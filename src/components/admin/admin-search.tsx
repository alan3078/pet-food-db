"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useProducts } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AdminSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { data: products = [] } = useProducts()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search products...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search products by name, brand, origin..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Products">
            {products.map((product) => (
              <CommandItem
                key={product.barcode}
                value={`${product.name_en} ${product.brand?.name || ""} ${product.origin_verbatim_text || ""} ${product.category || ""}`}
                onSelect={() => {
                  runCommand(() => router.push(`/admin/products/${product.barcode}`))
                }}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{product.name_en}</span>
                    <Badge variant="outline" className="text-xs">{product.brand?.name || "Unknown"}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {product.origin_verbatim_text && <span>{product.origin_verbatim_text}</span>}
                    {product.category && (
                      <>
                        <span>•</span>
                        <span>{product.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
