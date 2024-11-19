import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type ShouldRevalidateFunctionArgs,
  Link,
} from "@remix-run/react";
import { redirect, type DataFunctionArgs } from "@remix-run/node";

import { getAuthFromRequest } from "./auth/auth";
import { NavBar } from "./components/NavBar";
import "./tailwind.css";
import { NextUIProvider } from "@nextui-org/react";
import { Footer } from "./components/Footer";

export async function loader({ request }: DataFunctionArgs) {
  let auth = await getAuthFromRequest(request);
  if (auth && new URL(request.url).pathname === "/") {
    throw redirect("/home");
  }
  return auth;
}

export function shouldRevalidate({ formAction }: ShouldRevalidateFunctionArgs) {
  return formAction && ["/login", "/signup", "logout"].includes(formAction);
}

if (typeof document !== "undefined") {
  const isDark =
    localStorage.theme === "dark" ||
    (!localStorage.theme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

export default function App() {
  let userId = useLoaderData<typeof loader>();

  const darkModeScript = `
    (function() {
      const isDark = localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', isDark);
    })();
  `;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body className="dark:bg-black bg-silver text-black dark:text-silver">
        <NextUIProvider>
          <div className="flex h-full min-h-screen flex-col">
            <NavBar userId={userId} />

            <div className="mt-24 h-full min-h-0 flex-grow">
              <Outlet />
            </div>
            <Footer />
          </div>

          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}
