"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import clsx from "clsx";

export const Command = React.forwardRef(function Command(
  { className, ...props },
  ref
) {
  return (
    <CommandPrimitive
      ref={ref}
      className={clsx(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-gray-800",
        className
      )}
      {...props}
    />
  );
});

export const CommandGroup = React.forwardRef(function CommandGroup(
  { className, ...props },
  ref
) {
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={clsx("p-2 text-sm text-gray-700", className)}
      {...props}
    />
  );
});

export const CommandItem = React.forwardRef(function CommandItem(
  { className, ...props },
  ref
) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={clsx(
        "flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-100",
        className
      )}
      {...props}
    />
  );
});

export const CommandInput = React.forwardRef(function CommandInput(
  { className, ...props },
  ref
) {
  return (
    <CommandPrimitive.Input
      ref={ref}
      className={clsx(
        "border-b px-3 py-2 text-sm outline-none focus:border-gray-300",
        className
      )}
      {...props}
    />
  );
});

export const CommandList = React.forwardRef(function CommandList(
  { className, ...props },
  ref
) {
  return (
    <CommandPrimitive.List
      ref={ref}
      className={clsx("overflow-y-auto p-2", className)}
      {...props}
    />
  );
});

export const CommandSeparator = React.forwardRef(function CommandSeparator(
  { className, ...props },
  ref
) {
  return (
    <CommandPrimitive.Separator
      ref={ref}
      className={clsx("my-2 h-px bg-gray-200", className)}
      {...props}
    />
  );
});
