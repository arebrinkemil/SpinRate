import { Divider } from "@nextui-org/react";

export const Footer = () => {
  return (
    <>
      <div className="text-silver bg-darkgray mt-8 flex w-full flex-row py-4">
        <ul className="flex w-full flex-col justify-center gap-2 px-4 lg:flex-row lg:gap-4 lg:py-4">
          <li>Made in REMIX</li>

          <li>By Emil Årebrink</li>

              <li>2025 self hosted</li>

          <li>Contact: earebrink@gmail.com</li>
        </ul>
      </div>
    </>
  );
};
