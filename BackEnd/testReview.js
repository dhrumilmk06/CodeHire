import { prisma } from './src/lib/db.js';
import { reviewWhiteboardDesign } from './src/controllers/aiWhiteboardController.js';

async function test() {
    const snapshot = await prisma.whiteboardSnapshot.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (!snapshot) {
        console.log('No snapshot found to test with.');
        process.exit(0);
    }

    console.log('Testing with snapshot:', snapshot.id);

    const req = {
        body: {
            snapshotId: snapshot.id,
            sessionId: snapshot.sessionId,
            designContext: 'Test context'
        }
    };

    const res = {
        status: (code) => {
            console.log('Status code:', code);
            return res;
        },
        json: (data) => {
            console.log('JSON response:', JSON.stringify(data, null, 2));
            return res;
        }
    };

    const next = (err) => {
        console.error('Error passed to next:', err);
    };

    await reviewWhiteboardDesign(req, res, next);
    process.exit(0);
}

test();
