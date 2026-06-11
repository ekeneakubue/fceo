-- CreateTable
CREATE TABLE "Hero" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "imageDataUrl" TEXT NOT NULL,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "slideOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hero_slideOrder_idx" ON "Hero"("slideOrder");
