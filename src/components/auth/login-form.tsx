"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailLogin, emailSignup } from "@/app/login/actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "請輸入有效的電子郵件地址",
  }),
  password: z.string().min(6, {
    message: "密碼必須至少包含 6 個字符",
  }),
  role: z.enum(["user", "admin"]).optional(),
  signupCode: z.string().optional(),
});

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (mode === 'signup') {
        if (role === 'admin' && !values.signupCode) {
          form.setError("signupCode", { message: "管理員註冊必須輸入註冊碼" });
          setIsLoading(false);
          return;
        }

        result = await emailSignup({
          email: values.email,
          password: values.password,
          role: role,
          signupCode: values.signupCode,
        });
      } else {
        result = await emailLogin({
          email: values.email,
          password: values.password
        });
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (err) {
      setError("發生未知錯誤");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {/* Login/Signup Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`text-sm font-medium py-2 rounded-md transition-all ${
            mode === 'login' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          登入
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`text-sm font-medium py-2 rounded-md transition-all ${
            mode === 'signup' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          註冊
        </button>
      </div>

      {mode === 'signup' && (
        <div className="grid grid-cols-2 gap-2 p-1 bg-blue-50 rounded-lg">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`text-sm font-medium py-2 rounded-md transition-all ${
              role === 'user' 
                ? 'bg-white text-blue-700 shadow-sm border border-blue-100' 
                : 'text-blue-600/70 hover:text-blue-700'
            }`}
          >
            一般會員
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`text-sm font-medium py-2 rounded-md transition-all ${
              role === 'admin' 
                ? 'bg-white text-blue-700 shadow-sm border border-blue-100' 
                : 'text-blue-600/70 hover:text-blue-700'
            }`}
          >
            管理員
          </button>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>電子郵件</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密碼</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {mode === 'signup' && role === 'admin' && (
            <FormField
              control={form.control}
              name="signupCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>管理員註冊碼</FormLabel>
                  <FormControl>
                    <Input placeholder="請輸入註冊碼" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? '登入' : role === 'admin' ? '註冊管理員帳號' : '註冊會員帳號'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
