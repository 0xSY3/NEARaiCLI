// src/config/compiler.ts
export const COMPILER_CONFIG = {
    RUST_COMPILER_URL: process.env.RUST_COMPILER_URL || 'https://near-rust-compiler.example.com/compile',
    AS_COMPILER_VERSION: '0.27.0',
    NEAR_SDK_VERSION: '3.2.3'
};