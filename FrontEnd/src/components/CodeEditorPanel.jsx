import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, WifiIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

export const CodeEditorPanel = ({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  isConnected = false,
  remoteUser = null,   // { name, role } of the remote participant if they are typing
}) => {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select
            className="select select-sm"
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>

          {/* Live sync indicator */}
          {isConnected && (
            <div className="flex items-center gap-1.5 text-xs text-success font-medium">
              <WifiIcon className="size-3 animate-pulse" />
              <span>Live</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Remote user typing indicator */}
          {remoteUser && (
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${remoteUser.role === "host" ? "bg-emerald-400" : "bg-violet-400"
                  } animate-pulse`}
              />
              <span className="text-xs text-base-content/60">
                {remoteUser.name} is typing…
              </span>
            </div>
          )}

          <button
            className="btn btn-primary btn-sm gap-2"
            disabled={isRunning}
            onClick={onRunCode}
          >
            {isRunning ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="size-4" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
};
