-- CreateTable
CREATE TABLE "Leadership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile" TEXT,
    "imageDataUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leadership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Leadership_sortOrder_idx" ON "Leadership"("sortOrder");
