ALTER TABLE "Business" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';
UPDATE "Business" SET "slug" = LOWER(REPLACE("name", ' ', '-'));
ALTER TABLE "Business" ALTER COLUMN "slug" DROP DEFAULT;
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");