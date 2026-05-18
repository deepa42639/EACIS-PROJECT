const { SerialPortStream } = require('@serialport/stream');
const { MockBinding } = require('@serialport/binding-mock');
const http = require('http');
const { Server } = require('socket.io');

// 1. Initialize HTTP Server and WebSockets for Low-Latency HUD Synchronization
const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });

// 2. Initialize Virtual Serial Stream to Simulate LPWAN/Hardware Bridge Transmissions
MockBinding.createPort('COM3', { echo: true, record: true });
const port = new SerialPortStream({ binding: MockBinding, path: 'COM3', baudRate: 115200 });

// Active LoRa Network Infrastructure Routing Topology
const meshNodes = ["NODE_BENGALURU_NORTH", "NODE_SARJAPUR_HUB", "NODE_BELLANDUR_MESH"];

/**
 * Autonomous LPWAN Mesh Routing Simulation Layer
 * Implements hop-tracking and encapsulates packet metadata locally.
 */
function relayMeshPacket(packet) {
    const hopCount = Math.floor(Math.random() * 5) + 1;
    const currentNode = meshNodes[Math.floor(Math.random() * meshNodes.length)];
    
    console.log(`[MESH MGR] Packet Received from ${currentNode}`);
    console.log(`[MESH MGR] Relaying to Mesh Grid | Hops: ${hopCount} | Integrity: 100%`);
    
    return {
        ...packet,
        mesh_metadata: {
            last_hop: currentNode,
            total_hops: hopCount,
            network_type: "OFFLINE_RF_MESH"
        }
    };
}

console.log("--- EACIS NEXT-GEN BENGALURU GEO-BRIDGE ---");

// Local Context Extraction Matrix (Simulating Offline Gemma 4 Inference)
const FIRST_AID_KNOWLEDGE = `
EMERGENCY FIRST AID STEPS:
1. BLEEDING: Apply direct pressure with clean cloth. Elevate wound.
2. FLOOD WATER EXPOSURE: Wash skin immediately with soap. Do not ingest.
3. FRACTURES: Immobilize the limb. Do not attempt to reset bone.
4. SHOCK: Lay person flat, keep warm, and reassure them.
`;

function getOfflineMedicalAdvice(threatType) {
    console.log(`Gemma 4 analyzing threat: ${threatType}`);
    // Extract local context dynamically without internet or cloud dependency
    const extractedAdvice = FIRST_AID_KNOWLEDGE.split('2.')[1].split('3.')[0].trim();
    return `OFFLINE AI ADVICE: Based on the ${threatType}, ${extractedAdvice}`;
}

// Active UI WebSocket Connection Router
io.on('connection', (socket) => {
    console.log("RADAR UI CONNECTED VIA WEBSOCKET");

    // Recurrent Telemetry Broadcast Cycle (10-Second Intervals)
    const alertInterval = setInterval(() => {
        const threat = "Severe Urban Flash Flood";
        const medicalAdvice = getOfflineMedicalAdvice(threat);
        const predictedThreat = "IMMEDIATE STRUCTURAL COLLAPSE RISK";
        
        // Structured Telemetry Object Structure
        const baseAlert = {
            alert_type: threat,
            predicted_threat: predictedThreat,
            priority_level: 1, 
            location: { lat: 12.9348, lon: 77.6931 }, 
            safety_zone: { 
                name: "Elevated Command Center - Sarjapur",
                lat: 12.9250, lon: 77.6750
            },
            countdown_sec: 300,
            siren_trigger: true,
            medical_steps: medicalAdvice,
            family_beacon: {
                member_id: "Family Member A",
                status: "OK", 
                rssi: -85, 
                relative_pos: { angle: 135, distance: 0.7 } 
            }
        };

        // Encapsulate packet with routing layers and transmit across local network socket
        const meshSecuredAlert = relayMeshPacket(baseAlert);
        socket.emit('disaster_update', meshSecuredAlert);
        console.log("SIMULATION ACTIVE: MESH PACKET BROADCASTED\n");
    }, 10000);

    socket.on('disconnect', () => {
        clearInterval(alertInterval);
        console.log("RADAR UI DISCONNECTED");
    });
});

server.listen(3000, () => console.log("EACIS Server running on port 3000"));