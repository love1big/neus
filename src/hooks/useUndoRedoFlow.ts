import { useState, useCallback, useRef, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';

export function useUndoRedoFlow(nodes: Node[], edges: Edge[], setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void) {
  const [past, setPast] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [future, setFuture] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [isUndoing, setIsUndoing] = useState(false);
  
  const timerRef = useRef<any>(null);
  const isFirstRender = useRef(true);

  // We expose specific methods to trigger snapshots explicitly,
  // usually easier than fighting the useNodesState hook's frequent updates.
  const takeSnapshot = useCallback(() => {
    setPast((p) => {
      if (p.length > 0) {
        const last = p[p.length - 1];
        if (JSON.stringify(last.nodes) === JSON.stringify(nodes) && JSON.stringify(last.edges) === JSON.stringify(edges)) {
          return p;
        }
      }
      return [...p.slice(-50), { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }];
    });
    setFuture([]);
  }, [nodes, edges]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    setIsUndoing(true);
    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...f]);
    setNodes(previous.nodes);
    setEdges(previous.edges);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsUndoing(false), 50);
  }, [past, nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    setIsUndoing(true);
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
    setNodes(next.nodes);
    setEdges(next.edges);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsUndoing(false), 50);
  }, [future, nodes, edges, setNodes, setEdges]);
  
  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return { takeSnapshot, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}
