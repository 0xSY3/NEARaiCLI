import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

interface CompilationResult {
  success: boolean;
  wasm?: string;
  error?: string;
}

export async function compileContract(
  code: string,
  language: 'rust' | 'assemblyscript'
): Promise<CompilationResult> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'near-compile-'));
  
  try {
    if (language === 'rust') {
      return await compileRust(code, tempDir);
    } else {
      return await compileAssemblyScript(code, tempDir);
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function compileRust(code: string, tempDir: string): Promise<CompilationResult> {
  // Create Cargo.toml
  const cargoToml = `
[package]
name = "near-contract"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
near-sdk = "4.1.1"
near-contract-standards = "4.1.1"

[profile.release]
codegen-units = 1
opt-level = "z"
lto = true
debug = false
panic = "abort"
overflow-checks = true
`;

  await fs.mkdir(path.join(tempDir, 'src'), { recursive: true });
  await fs.writeFile(path.join(tempDir, 'Cargo.toml'), cargoToml);
  await fs.writeFile(path.join(tempDir, 'src', 'lib.rs'), code);

  try {
    execSync('cargo build --target wasm32-unknown-unknown --release', {
      cwd: tempDir,
      stdio: 'pipe',
    });

    const wasmPath = path.join(
      tempDir,
      'target',
      'wasm32-unknown-unknown',
      'release',
      'near_contract.wasm'
    );

    const wasmBuffer = await fs.readFile(wasmPath);
    return {
      success: true,
      wasm: wasmBuffer.toString('base64'),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Rust compilation failed',
    };
  }
}

async function compileAssemblyScript(code: string, tempDir: string): Promise<CompilationResult> {
  // Create package.json
  const packageJson = {
    name: 'near-contract',
    version: '1.0.0',
    scripts: {
      asbuild: 'asc assembly/index.ts --target release'
    },
    dependencies: {
      'near-sdk-as': '^3.2.3'
    }
  };

  await fs.mkdir(path.join(tempDir, 'assembly'), { recursive: true });
  await fs.writeFile(
    path.join(tempDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  await fs.writeFile(path.join(tempDir, 'assembly', 'index.ts'), code);

  try {
    execSync('npm install && npm run asbuild', {
      cwd: tempDir,
      stdio: 'pipe',
    });

    const wasmPath = path.join(tempDir, 'build', 'release.wasm');
    const wasmBuffer = await fs.readFile(wasmPath);
    
    return {
      success: true,
      wasm: wasmBuffer.toString('base64'),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AssemblyScript compilation failed',
    };
  }
}