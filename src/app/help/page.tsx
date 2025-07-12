'use client';

import Header from '@/components/header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const faqs = [
    {
        question: "How do I start an inspection?",
        answer: "To start an inspection, navigate to the main page and either upload an image of the product or use the 'Capture from Camera' option to take a new photo."
    },
    {
        question: "What do the different result colors mean?",
        answer: "A green 'Normal' badge indicates the product has passed inspection. A red 'Defective' badge means an anomaly was detected. The details of the defect will be displayed below the image."
    },
    {
        question: "How accurate is the AI detection?",
        answer: "Our AI model is trained on a vast dataset of product images and provides high-accuracy results. A confidence score is provided for each detection to indicate the model's certainty."
    },
    {
        question: "Can I switch between front and back cameras?",
        answer: "Yes. When the camera view is open, a switch camera icon will appear at the bottom-right. Click it to toggle between your device's front and rear cameras."
    },
     {
        question: "Where can I see my past inspections?",
        answer: "The 'Detection Log' on the main page contains a history of all your recent inspections, including the image, result, and timestamp."
    }
]

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">Help & FAQs</CardTitle>
            <CardDescription>Find answers to common questions.</CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                        {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
