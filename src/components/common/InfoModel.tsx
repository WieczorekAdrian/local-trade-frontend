import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ReactNode } from "react";

interface InfoModalProps {
  triggerText: string;
  title: string;
  children: ReactNode;
}

export function InfoModal({ triggerText, title, children }: InfoModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 rounded-sm p-1 -m-1">
          {triggerText}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto rounded-xl p-8 md:p-10 shadow-xl border border-primary/10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold tracking-tighter text-foreground pb-6 border-b-2 border-primary/20">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-8 space-y-6 text-base leading-relaxed text-muted-foreground">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
