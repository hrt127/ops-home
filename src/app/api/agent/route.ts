
import { NextResponse } from 'next/server';
import { AgentRequestPayload, AgentResponsePayload } from '../../../lib/agent-types';

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as AgentRequestPayload;

        // Mock agent logic for now
        // In a real implementation this would call an LLM

        const summary = generateSummary(body);
        const bullets = generateBullets(body);
        const warnings = generateWarnings(body);

        const response: AgentResponsePayload = {
            summary,
            bullets,
            warnings
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Agent API error:', error);
        return NextResponse.json(
            { error: 'Failed to process agent request' },
            { status: 500 }
        );
    }
}

function generateSummary(payload: AgentRequestPayload): string {
    const { mode, today } = payload;
    if (mode === 'daily-plan') {
        return `Analyzing daily plan for ${today.focus || 'general operations'}. Risk level set to ${today.riskLevel}/10. Current configuration suggests a balanced approach between stability and execution speed.`;
    }
    if (mode === 'risk-audit') {
        return `Scanning wallet configuration for cross-contamination vectors. Detected ${payload.wallets.length} active wallets. Isolation protocols appear nominal but warrant manual verification of recent 'spec-play' interactions.`;
    }
    return `System ready. Awaiting specific instruction set. Mode: ${mode}.`;
}

function generateBullets(payload: AgentRequestPayload): string[] {
    const { mode, wallets } = payload;
    if (mode === 'daily-plan') {
        return [
            "Primary objective aligned with system priorities.",
            "Time allocation optimal for current event density.",
            "Resource availability confirmed."
        ];
    }
    if (mode === 'risk-audit') {
        const highRisk = wallets.filter(w => w.riskBand === 'speculative').length;
        return [
            `Detected ${highRisk} speculative access points.`,
            "Cold storage separation: VERIFIED.",
            "Browser profile isolation: ENFORCED."
        ];
    }
    return ["System nominal.", "No anomalies detected."];
}

function generateWarnings(payload: AgentRequestPayload): string[] {
    const { today } = payload;
    const warnings: string[] = [];

    if (today.riskLevel > 7) {
        warnings.push("Risk level CRITICAL. Double check all signature requests.");
        warnings.push("Recommend activating 'Paranoia Mode' for all transactions.");
    }

    if (!today.focus) {
        warnings.push("No primary focus defined. Entropy increase likely.");
    }

    return warnings;
}
