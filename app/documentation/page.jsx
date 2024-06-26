"use client";
import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AuthContext } from "@/context/Context";
const page = () => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  function handleClick() {
    setAuthenticated(!authenticated);
  }
  console.log("Is he authenticated? (doc) ", authenticated);
  return (
    <div className="p-20">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
      <Button variant="destructive">Destructive</Button>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div>
        <button onClick={handleClick} className="p-2 bg-black text-white">
          Click to see
        </button>
        {authenticated ? (
          <p>Authenticated is true </p>
        ) : (
          <p>Authenticated is false </p>
        )}
      </div>
    </div>
  );
};

export default page;
