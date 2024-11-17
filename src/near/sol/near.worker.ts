import { createWasmPlugin } from "assemblyscript/dist/plugins/wasm";
import { Buffer } from 'buffer';

// Define compiler options for AssemblyScript
const AS_CONFIG = {
    WASI: true,
    IMPORT_MEMORY: true,
    MAXIMUM_MEMORY: 2048,
    MAXIMUM_PAGE_SIZE: 2048,
    TOTAL_STACK: 1048576,
    TOTAL_MEMORY: 16777216,
};

// Define interface for compilation result
interface CompilationResult {
    success: boolean;
    contractName: string;
    wasmFile?: Uint8Array;
    metadata?: any;
    error?: string;
}

// Interface for received message data
interface WorkerMessage {
    contractCode: string;
    language: 'rust' | 'assemblyscript';
    contractName?: string;
}

// Worker message handler
self.onmessage = async function(e: MessageEvent<WorkerMessage>) {
    const { contractCode, language, contractName = 'near_contract' } = e.data;

    try {
        let result: CompilationResult;

        if (language === 'assemblyscript') {
            result = await compileAssemblyScript(contractCode, contractName);
        } else if (language === 'rust') {
            result = await compileRustRemote(contractCode, contractName);
        } else {
            throw new Error('Unsupported language');
        }

        self.postMessage({ output: result });
    } catch (error) {
        self.postMessage({
            output: {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown compilation error',
                contractName: contractName
            }
        });
    }
};

// AssemblyScript compilation function
async function compileAssemblyScript(code: string, contractName: string): Promise<CompilationResult> {
    try {
        // Add necessary NEAR imports if they don't exist
        const nearImports = `
import { storage, context, logging, u128, PersistentMap } from "near-sdk-as";

`;
        const fullCode = code.includes('near-sdk-as') ? code : nearImports + code;

        // Create a virtual file system for the compiler
        const files = new Map<string, string>();
        files.set('input.ts', fullCode);

        // Configure compiler options
        const options = {
            optimizeLevel: 3,
            shrinkLevel: 2,
            converge: false,
            noAssert: false,
            debug: true,
            ...AS_CONFIG
        };

        // Create compilation context
        const { binary, text } = await asc.compile(files, options);

        if (!binary) {
            throw new Error('AssemblyScript compilation failed to produce binary output');
        }

        // Add NEAR-specific sections to WASM binary
        const wasmFile = addNearWasmSections(binary);

        return {
            success: true,
            contractName,
            wasmFile,
            metadata: {
                language: 'assemblyscript',
                version: '0.1.0',
                compiler: 'asc',
                compiledAt: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('AssemblyScript compilation error:', error);
        throw new Error(`AssemblyScript compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Function to compile Rust code using remote service
async function compileRustRemote(code: string, contractName: string): Promise<CompilationResult> {
    try {
        // Add necessary NEAR crate imports if they don't exist
        const nearImports = `
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};

`;
        const fullCode = code.includes('near_sdk') ? code : nearImports + code;

        // Call remote compilation service
        const response = await fetch('https://near-rust-compiler.example.com/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: fullCode,
                contractName,
                target: 'wasm32-unknown-unknown',
                release: true
            })
        });

        if (!response.ok) {
            throw new Error(`Remote compilation failed: ${response.statusText}`);
        }

        const result = await response.json();

        // Convert Base64 WASM to Uint8Array
        const wasmFile = new Uint8Array(Buffer.from(result.wasm, 'base64'));

        return {
            success: true,
            contractName,
            wasmFile,
            metadata: {
                language: 'rust',
                version: result.version,
                compiler: 'rustc',
                compiledAt: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('Rust compilation error:', error);
        throw new Error(`Rust compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Helper function to add NEAR-specific sections to WASM binary
function addNearWasmSections(wasmBinary: Uint8Array): Uint8Array {
    // Add custom sections required by NEAR Protocol
    const customSections = {
        'nearv1': new Uint8Array([0x01]), // Version identifier
        'metadata': new TextEncoder().encode(JSON.stringify({
            compiler: 'asc',
            version: '0.1.0'
        }))
    };

    let result = new Uint8Array(wasmBinary);

    // Add each custom section
    for (const [name, data] of Object.entries(customSections)) {
        const nameBytes = new TextEncoder().encode(name);
        const sectionSize = 1 + nameBytes.length + data.length;
        
        const section = new Uint8Array(sectionSize);
        section[0] = nameBytes.length;
        section.set(nameBytes, 1);
        section.set(data, 1 + nameBytes.length);

        // Combine with existing binary
        const newBinary = new Uint8Array(result.length + section.length);
        newBinary.set(result);
        newBinary.set(section, result.length);
        result = newBinary;
    }

    return result;
}

// Helper function for error handling
function handleCompilationError(error: unknown): never {
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Unknown compilation error occurred');
}

// Utility functions for binary manipulation
const binaryUtils = {
    concatArrays(...arrays: Uint8Array[]): Uint8Array {
        const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    },

    stringToBytes(str: string): Uint8Array {
        return new TextEncoder().encode(str);
    },

    bytesToBase64(bytes: Uint8Array): string {
        return Buffer.from(bytes).toString('base64');
    }
};

// Export types for TypeScript
export type {
    CompilationResult,
    WorkerMessage
};