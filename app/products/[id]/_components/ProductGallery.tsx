"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageOffIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { ProductImage } from "@/lib/products";

const slideClassName =
  "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted lg:aspect-auto lg:h-full";
const fillColumnHeightClassName = "lg:h-full";
const slideSizes = "(min-width: 1024px) 58vw, 100vw";
const navigationButtonClassName = "hidden sm:inline-flex";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    if (!api) return;
    const showSelectedSlide = () => setCurrentSlide(api.selectedScrollSnap() + 1);
    api.on("select", showSelectedSlide);
    return () => {
      api.off("select", showSelectedSlide);
    };
  }, [api]);

  if (images.length === 0) {
    return (
      <div className={slideClassName}>
        <ImageOffIcon
          aria-hidden="true"
          className="absolute inset-0 m-auto size-10 text-muted-foreground"
        />
      </div>
    );
  }

  const hasSeveralImages = images.length > 1;

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: hasSeveralImages }}
      aria-label={`${productName} photos`}
      className="lg:h-full lg:[&>[data-slot=carousel-content]]:h-full"
    >
      <CarouselContent className={fillColumnHeightClassName}>
        {images.map((image, index) => (
          <CarouselItem key={image.id} className={fillColumnHeightClassName}>
            <div className={slideClassName}>
              <Image
                src={image.url}
                alt={`${productName}, photo ${index + 1} of ${images.length}`}
                fill
                sizes={slideSizes}
                unoptimized
                priority={index === 0}
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {hasSeveralImages && (
        <>
          <CarouselPrevious size="icon-lg" className={`left-3 ${navigationButtonClassName}`} />
          <CarouselNext size="icon-lg" className={`right-3 ${navigationButtonClassName}`} />
          <Badge variant="secondary" className="absolute right-3 bottom-3 tabular-nums">
            {currentSlide} / {images.length}
          </Badge>
        </>
      )}
    </Carousel>
  );
};
