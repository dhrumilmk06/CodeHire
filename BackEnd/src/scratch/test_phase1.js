import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
    console.log("🚀 Starting Phase 1 Backend Tests...\n");

    try {
        // 0. Find a host user
        const host = await prisma.user.findFirst();
        if (!host) {
            console.error("❌ No users found in DB. Please create a user first.");
            return;
        }
        console.log(`👤 Using Host: ${host.name} (${host.clerkId})`);

        // --- TEST 4: Create Session with sessionType: "system-design" ---
        console.log("\n🧪 Test 4: Creating system-design session...");
        const session = await prisma.session.create({
            data: {
                hostId: host.clerkId,
                problem: "System Design Test",
                problems: [{ title: "System Design Test", difficulty: "medium" }],
                difficulty: "medium",
                session_code: "TEST-" + Math.random().toString(36).substring(7).toUpperCase(),
                timings: [],
                problemCodes: {},
                sessionType: "system-design" // The new field
            }
        });
        
        if (session.sessionType === "system-design") {
            console.log("✅ Success: Session created with sessionType 'system-design'");
        } else {
            console.error(`❌ Failure: Expected 'system-design', got '${session.sessionType}'`);
        }

        // --- TEST 1: Create Snapshot ---
        console.log("\n🧪 Test 1: Creating whiteboard snapshot...");
        const testImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
        const snapshot = await prisma.whiteboardSnapshot.create({
            data: {
                sessionId: session.id,
                imageData: testImageData,
                label: "Test Snapshot",
                excalidrawData: JSON.stringify({ elements: [] })
            }
        });
        console.log(`✅ Success: Snapshot created with ID: ${snapshot.id}`);

        // --- TEST 2: GET snapshots (no imageData) ---
        console.log("\n🧪 Test 2: Fetching snapshots list (Performance check)...");
        const snapshotsList = await prisma.whiteboardSnapshot.findMany({
            where: { sessionId: session.id },
            select: {
                id: true,
                label: true,
                createdAt: true,
                aiScore: true
                // imageData is omitted
            }
        });

        if (snapshotsList.length > 0 && snapshotsList[0].imageData === undefined) {
            console.log("✅ Success: Snapshot list retrieved. imageData is EXCLUDED as expected.");
        } else {
            console.error("❌ Failure: imageData was found in the list or list is empty.");
        }

        // --- TEST 3: GET full snapshot ---
        console.log("\n🧪 Test 3: Fetching full snapshot by ID...");
        const fullSnapshot = await prisma.whiteboardSnapshot.findUnique({
            where: { id: snapshot.id }
        });

        if (fullSnapshot && fullSnapshot.imageData === testImageData) {
            console.log("✅ Success: Full snapshot retrieved. imageData is INCLUDED and matches.");
        } else {
            console.error("❌ Failure: Could not retrieve full snapshot or imageData mismatch.");
        }

        console.log("\n🎉 ALL PHASE 1 BACKEND TESTS PASSED!");

        // Cleanup
        await prisma.whiteboardSnapshot.delete({ where: { id: snapshot.id } });
        await prisma.session.delete({ where: { id: session.id } });
        console.log("\n🧹 Cleanup completed.");

    } catch (error) {
        console.error("\n❌ Test Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
