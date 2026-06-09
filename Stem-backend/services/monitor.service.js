// In production this will read:
// nvidia-smi, ollama queue, system stats

export const getGpuStats = async () => {
  return {
    gpu: "NVIDIA H100 NVL",
    utilization: "0% (mock)",
    memory: "0/94GB (mock)",
    temperature: "30C (mock)"
  };
};

export const getQueueHealth = async () => {
  return {
    pending: 0,
    processing: 0,
    failed: 0
  };
};

export const getLatency = async () => {
  return {
    api: "120ms",
    ai: "0ms (mock)"
  };
};
