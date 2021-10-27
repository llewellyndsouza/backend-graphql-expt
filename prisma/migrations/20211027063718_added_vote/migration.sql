-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "linkId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "Vote_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_id_key" ON "Vote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_linkId_userId_key" ON "Vote"("linkId", "userId");
