"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).default("user"),
  signupCode: z.string().optional(),
});

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?error=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/login?error=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function emailLogin(data: z.infer<typeof loginSchema>) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function emailSignup(data: z.infer<typeof signupSchema>) {
  const supabase = await createClient();

  // Verify signup code for admin
  if (data.role === 'admin') {
    if (!data.signupCode) {
      return { error: "管理員註冊必須輸入註冊碼" };
    }

    // Check code in DB
    const { data: codeRecord, error: codeError } = await supabase
      .from('Signup_Code')
      .select('*')
      .eq('code', data.signupCode)
      .single();

    if (codeError || !codeRecord) {
      return { error: "無效的註冊碼" };
    }

    if (codeRecord.is_used || (codeRecord.max_uses && codeRecord.used_count >= codeRecord.max_uses)) {
      return { error: "此註冊碼已失效" };
    }

    if (codeRecord.expires_at && new Date(codeRecord.expires_at) < new Date()) {
      return { error: "此註冊碼已過期" };
    }
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        role: data.role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Update signup code usage if success
  if (data.role === 'admin' && data.signupCode) {
    // Increment usage count
    const { data: codeRecord } = await supabase
      .from('Signup_Code')
      .select('*')
      .eq('code', data.signupCode)
      .single();
      
    if (codeRecord) {
      const newCount = (codeRecord.used_count || 0) + 1;
      const isUsed = codeRecord.max_uses ? newCount >= codeRecord.max_uses : false;
      
      await supabase
        .from('Signup_Code')
        .update({ 
          used_count: newCount,
          is_used: isUsed,
          used_at: new Date().toISOString()
        })
        .eq('id', codeRecord.id);
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}
