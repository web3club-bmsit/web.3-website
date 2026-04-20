"use server";

import { createClient } from "@/utils/supabase/server";

export async function registerForEvent(
  data: { name: string; email: string; college: string; year: string; event: string },
  turnstileToken: string
) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { success: false, error: "Server configuration error. Turnstile secret missing." };
  }

  if (!turnstileToken) {
    return { success: false, error: "CAPTCHA validation failed. Missing token." };
  }

  try {
    // Validate Cloudflare Turnstile token
    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("response", turnstileToken);

    const checkRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    
    const checkJson = await checkRes.json();

    if (!checkJson.success) {
      console.error("Turnstile verification failed:", checkJson);
      return { success: false, error: "CAPTCHA validation failed. Please try again." };
    }

    // Insert into Supabase registrations table
    const supabaseClient = await createClient();
    const { error } = await supabaseClient.from("registrations").insert([
      {
        name: data.name,
        email: data.email,
        college: data.college,
        year: data.year,
        event: data.event,
      },
    ]);

    if (error) {
      if (error.code === "23505") { // PostgreSQL unique_violation error code
        return { success: false, error: "Email is already registered for this event." };
      }
      console.error("Supabase Database Insert Error: ", error);
      return { success: false, error: "A database error occurred. Try again later." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Registration Exception: ", err);
    return { success: false, error: "An unexpected error occurred during registration." };
  }
}
