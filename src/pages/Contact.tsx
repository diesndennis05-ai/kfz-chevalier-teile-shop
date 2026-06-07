import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useCreateInquiry, useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Name ist erforderlich"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  message: z.string().min(10, "Bitte beschreiben Sie Ihr Anliegen etwas ausführlicher"),
  productId: z.number().nullable(),
});

export default function Contact() {
  const searchString = useSearch();
  const { toast } = useToast();
  const createInquiry = useCreateInquiry();
  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey() } });
  
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      productId: null,
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const partNo = params.get('part');
    const idParam = params.get('id');
    
    let defaultMsg = "";
    if (partNo) {
      defaultMsg = `Ich interessiere mich für Teilenummer ${partNo}.\n\nBitte teilen Sie mir die Versandkosten an meine Adresse mit.`;
    } else if (cart && cart.items.length > 0) {
      const parts = cart.items.map(i => `${i.quantity}x ${i.product.partNumber} (${i.product.name})`).join('\n');
      defaultMsg = `Ich möchte ein Angebot für folgende Teile aus meiner Anfrageliste anfordern:\n\n${parts}\n\nBitte nennen Sie mir den Gesamtpreis inklusive Versand.`;
    }

    if (defaultMsg) {
      form.setValue('message', defaultMsg);
    }
    if (idParam && !isNaN(parseInt(idParam, 10))) {
      form.setValue('productId', parseInt(idParam, 10));
    }
  }, [searchString, cart, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createInquiry.mutate({ data: values }, {
      onSuccess: () => {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: () => {
        toast({
          title: "Fehler beim Senden",
          description: "Beim Absenden Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
          variant: "destructive"
        });
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-sm flex items-center justify-center mx-auto mb-6 border border-primary/20">
          <Send className="w-10 h-10 ml-1" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Anfrage gesendet</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Vielen Dank für Ihre Anfrage an KFZ Chevalier. Unser Team wird Ihre Anfrage prüfen und sich innerhalb von 24 Stunden bei Ihnen melden.
        </p>
        <Button onClick={() => window.location.href = '/products'} size="lg" className="bg-primary hover:bg-primary/90">
          Weiter stöbern
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="w-10 h-0.5 bg-primary mb-3"></div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Kontakt & Anfragen</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Benötigen Sie ein bestimmtes Teil? Haben Sie technische Fragen? Schreiben Sie uns – unsere Kfz-Meister helfen Ihnen weiter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-sidebar border-sidebar-border text-sidebar-foreground">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1 text-sidebar-foreground">Anschrift</h3>
                    <p className="text-sm text-sidebar-foreground/60">Industriestraße 42<br/>80807 München<br/>Deutschland</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1 text-sidebar-foreground">Telefon</h3>
                    <p className="text-sm text-sidebar-foreground/60 font-mono">+49 89 123 456 78</p>
                    <p className="text-xs text-sidebar-foreground/40 mt-1">Mo–Fr, 08:00 – 17:00 Uhr</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1 text-sidebar-foreground">E-Mail</h3>
                    <p className="text-sm text-sidebar-foreground/60">parts@kfz-chevalier.de</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1 text-sidebar-foreground">Antwortzeit</h3>
                    <p className="text-sm text-sidebar-foreground/60">Technische Anfragen beantworten wir in der Regel innerhalb von 24 Stunden an Werktagen.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {cart && cart.items.length > 0 && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4 text-primary font-semibold text-sm">
                    <ShoppingBag className="w-5 h-5" />
                    Ihre Anfrageliste
                  </div>
                  <ul className="space-y-3 text-sm">
                    {cart.items.map((item, i) => (
                      <li key={i} className="flex justify-between items-start border-b border-border/50 pb-2 last:border-0 last:pb-0">
                        <span className="truncate pr-4 text-muted-foreground">{item.quantity}× {item.product.name}</span>
                        <span className="font-mono text-muted-foreground text-xs shrink-0">{item.product.partNumber}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vollständiger Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Johann Schmidt" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-Mail-Adresse</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="johann@werkstatt.de" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefonnummer (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+49 ..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nachricht / Technische Anfrage</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Bitte geben Sie VIN oder PR-Nummern an, falls Sie Kompatibilität prüfen lassen möchten..." 
                              className="min-h-[150px] font-mono text-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full sm:w-auto font-bold tracking-wide bg-primary hover:bg-primary/90" disabled={createInquiry.isPending}>
                      {createInquiry.isPending ? "Wird gesendet..." : "Anfrage absenden"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
