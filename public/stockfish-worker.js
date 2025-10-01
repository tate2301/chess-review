// Stockfish Worker for Next.js
// This worker loads and manages a Stockfish engine instance

let stockfish = null;
let isInitialized = false;
let engineType = "lite-single";

// Handle messages from main thread
self.onmessage = function (e) {
  const data = e.data;

  // Handle initialization message
  if (data && data.type === "init") {
    engineType = data.engine || "lite-single";
    initializeStockfish();
    return;
  }

  // Handle UCI commands
  if (!isInitialized || !stockfish) {
    self.postMessage("error: Stockfish not initialized");
    return;
  }

  try {
    if (stockfish.postMessage) {
      stockfish.postMessage(data);
    } else if (typeof stockfish === "function") {
      stockfish(data);
    }
  } catch (error) {
    self.postMessage("error: Command failed - " + error.message);
  }
};

// Initialize Stockfish
function initializeStockfish() {
  try {
    // Map engine types to stockfish files
    const engineFiles = {
      "lite-multi": "/stockfish/stockfish-17-lite.js",
      "lite-single": "/stockfish/stockfish-17-lite-single.js",
      "large-multi": "/stockfish/stockfish-17.js",
      "large-single": "/stockfish/stockfish-17-single.js",
    };

    const stockfishFile = engineFiles[engineType] || engineFiles["lite-single"];

    // Load the stockfish script
    importScripts(stockfishFile);

    // Initialize Stockfish
    if (typeof Stockfish !== "undefined") {
      // Configure Stockfish before initialization
      const stockfishOptions = {
        locateFile: function (file) {
          // Map WASM files to the correct location
          if (file.endsWith(".wasm")) {
            // Use a simplified WASM file mapping
            if (engineType.includes("single")) {
              return "/stockfish-worker.wasm";
            } else {
              return "/" + file;
            }
          }
          return file;
        },
      };

      stockfish = Stockfish(stockfishOptions);

      // Set up message forwarding
      if (stockfish && stockfish.addListener) {
        stockfish.addListener(function (message) {
          self.postMessage(message);
        });
      } else if (stockfish && stockfish.onmessage) {
        stockfish.onmessage = function (message) {
          self.postMessage(message);
        };
      }

      isInitialized = true;
      self.postMessage("Stockfish " + engineType + " ready");
    } else {
      throw new Error("Stockfish module not found after import");
    }
  } catch (error) {
    self.postMessage(
      "error: Failed to initialize Stockfish - " + error.message,
    );
  }
}

// Handle errors
self.onerror = function (error) {
  self.postMessage(
    "error: Worker error - " + (error.message || "Unknown error"),
  );
};

// Handle unhandled promise rejections
self.onunhandledrejection = function (event) {
  self.postMessage(
    "error: Promise rejection - " + (event.reason || "Unknown error"),
  );
};
