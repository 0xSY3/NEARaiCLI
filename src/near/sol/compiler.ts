interface ContractData {
    contractName: string;
    wasmFile: Uint8Array;
    metadata?: any;
}

export const compile = async (contractCode: string): Promise<ContractData[]> => {
    // For Rust contracts, we'll need to use wasm-pack or cargo
    // For AssemblyScript, we'll use asc
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL("./near.worker.ts", import.meta.url), { type: "module" }
        );
        
        worker.onmessage = function (e: any) {
            const output = e.data.output;
            
            if (!output.success) {
                reject(output.error || "Compilation failed");
                return;
            }

            resolve([{
                contractName: output.contractName,
                wasmFile: output.wasmFile,
                metadata: output.metadata
            }]);
        };
        
        worker.onerror = reject;
        
        worker.postMessage({
            contractCode: contractCode,
            language: detectLanguage(contractCode)
        });
    });
};

function detectLanguage(code: string): 'rust' | 'assemblyscript' {
    // Simple detection based on file content
    if (code.includes('use near_sdk::')) {
        return 'rust';
    }
    return 'assemblyscript';
}