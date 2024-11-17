"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Wand2, Loader, Code2, Rocket } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { UserSelection } from "@/types/types";
import ContractGeneration from "@/components/ContractGeneration";
import { CONTRACT_EXAMPLES } from "@/lib/contractTemplates";

const EXAMPLE_PROMPTS = [
  "Create a DAO with voting and treasury",
  "Build a game NFT with character attributes",
  "Design a token with staking features"
];

export default function Home() {
  const [code, setCode] = useState("");
  const [selection, setSelection] = useState<UserSelection>(UserSelection.AI);
  const [showPanels, setShowPanels] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Rotate example prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const generateContract = async () => {
    if (!prompt.trim()) {
      setError("Please describe your contract");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCode("// Initializing contract generation...");
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <Sidebar selection={selection} setSelection={setSelection} />

      <main className="pl-16 pt-16">
        <div className="h-[calc(100vh-4rem)]">
          <ResizablePanelGroup direction="horizontal">
            {/* Left Panel - Controls */}
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="h-full p-4 bg-[#161b22]">
                <div className="space-y-4">
                  {/* AI Generation Panel */}
                  {selection === UserSelection.AI && (
                    <>
                      <div className="glass-dark rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Wand2 className="w-4 h-4 text-near-cyan" />
                          <h3 className="text-near-cyan font-medium">Contract Generator</h3>
                        </div>
                        
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={EXAMPLE_PROMPTS[currentPromptIndex]}
                          className="w-full bg-[#0d1117] text-white rounded-lg p-3 min-h-[100px] resize-none border border-gray-800 focus:border-near-cyan outline-none"
                          disabled={isGenerating}
                        />

                        <button
                          onClick={generateContract}
                          disabled={isGenerating || !prompt.trim()}
                          className="mt-3 w-full px-4 py-2 bg-near-cyan/10 text-near-cyan rounded-lg flex items-center justify-center gap-2 hover:bg-near-cyan/20 transition-colors disabled:opacity-50"
                        >
                          {isGenerating ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4" />
                              Generate
                            </>
                          )}
                        </button>
                      </div>

                      {/* Generation Progress */}
                      {isGenerating && (
                        <ContractGeneration
                          prompt={prompt}
                          onComplete={(generatedCode) => {
                            setCode(generatedCode);
                            setIsGenerating(false);
                          }}
                        />
                      )}

                      {/* Templates */}
                      {!isGenerating && (
                        <div className="space-y-2">
                          <div className="text-sm text-gray-400">Templates</div>
                          {Object.entries(CONTRACT_EXAMPLES).map(([key, example]) => (
                            <button
                              key={key}
                              onClick={() => {
                                setPrompt(example.prompt);
                                generateContract();
                              }}
                              className="w-full p-3 bg-[#1c2128] rounded-lg text-left hover:border-near-cyan/20 border border-transparent transition-colors"
                            >
                              <div className="text-sm text-near-cyan mb-1">
                                {example.description}
                              </div>
                              <div className="text-xs text-gray-400">
                                {example.prompt}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Compile Panel */}
                  {selection === UserSelection.Compile && (
                    <div className="glass-dark rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Code2 className="w-4 h-4 text-near-cyan" />
                        <h3 className="text-near-cyan font-medium">Compile Contract</h3>
                      </div>
                      <button
                        className="w-full px-4 py-2 bg-near-cyan/10 text-near-cyan rounded-lg flex items-center justify-center gap-2 hover:bg-near-cyan/20 transition-colors"
                      >
                        <Code2 className="w-4 h-4" />
                        Compile
                      </button>
                    </div>
                  )}

                  {/* Deploy Panel */}
                  {selection === UserSelection.Deploy && (
                    <div className="glass-dark rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Rocket className="w-4 h-4 text-near-cyan" />
                        <h3 className="text-near-cyan font-medium">Deploy Contract</h3>
                      </div>
                      <button
                        className="w-full px-4 py-2 bg-near-cyan/10 text-near-cyan rounded-lg flex items-center justify-center gap-2 hover:bg-near-cyan/20 transition-colors"
                      >
                        <Rocket className="w-4 h-4" />
                        Deploy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-[2px] bg-[#1c2128]" />

            {/* Editor Panel */}
            <ResizablePanel defaultSize={75}>
              <div className="h-full bg-[#0d1117]">
                <Editor
                  height="100%"
                  defaultLanguage="rust"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    readOnly: isGenerating,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                  loading={
                    <div className="flex items-center justify-center h-full">
                      <Loader className="w-6 h-6 text-near-cyan animate-spin" />
                    </div>
                  }
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>

      {/* Error Toast */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500"
        >
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 hover:text-red-400"
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
}