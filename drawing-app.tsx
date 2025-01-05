import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, Moon, Sun, Square, Circle, Type, Eraser, 
  Save, Upload, Pencil, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

const DrawingApp = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(5);
  const [layers, setLayers] = useState([
    { id: 1, name: 'Layer 1', visible: true, notes: [], data: null }
  ]);
  const [activeLayer, setActiveLayer] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [roomId, setRoomId] = useState('default-room');
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const wsRef = useRef(null);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    if (!isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.7;
    
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;
  }, []);

  const drawShape = (shape) => {
    const context = contextRef.current;
    context.beginPath();
    context.strokeStyle = shape.color;
    context.lineWidth = shape.lineWidth;
    
    switch (shape.tool) {
      case 'pencil':
        context.moveTo(shape.start.x, shape.start.y);
        context.lineTo(shape.end.x, shape.end.y);
        break;
      case 'rectangle':
        const width = shape.end.x - shape.start.x;
        const height = shape.end.y - shape.start.y;
        context.strokeRect(shape.start.x, shape.start.y, width, height);
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(shape.end.x - shape.start.x, 2) + 
          Math.pow(shape.end.y - shape.start.y, 2)
        );
        context.arc(shape.start.x, shape.start.y, radius, 0, 2 * Math.PI);
        break;
      case 'eraser':
        context.globalCompositeOperation = 'destination-out';
        context.arc(shape.end.x, shape.end.y, shape.lineWidth, 0, Math.PI * 2);
        context.fill();
        context.globalCompositeOperation = 'source-over';
        break;
    }
    
    context.stroke();
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setStartPos({ x: offsetX, y: offsetY });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    const shape = {
      tool,
      color,
      lineWidth,
      start: startPos,
      end: { x: offsetX, y: offsetY }
    };
    
    const context = contextRef.current;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    shapes.forEach(s => drawShape(s));
    drawShape(shape);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack([...undoStack, imageData]);
    setRedoStack([]);
    
    setIsDrawing(false);
    setStartPos(null);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack([...redoStack, currentState]);
    
    const previousState = undoStack[undoStack.length - 1];
    context.putImageData(previousState, 0, 0);
    
    setUndoStack(undoStack.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack([...undoStack, currentState]);
    
    const nextState = redoStack[redoStack.length - 1];
    context.putImageData(nextState, 0, 0);
    
    setRedoStack(redoStack.slice(0, -1));
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    
    const updatedLayers = layers.map(layer => {
      if (layer.id === activeLayer) {
        return { ...layer, data: imageData };
      }
      return layer;
    });
    
    setLayers(updatedLayers);
    
    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.png`;
    link.href = imageData;
    link.click();
  };

  const loadDrawing = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const context = contextRef.current;
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(img, 0, 0);
        
        const imageData = context.getImageData(
          0, 0, 
          canvasRef.current.width, 
          canvasRef.current.height
        );
        setUndoStack([...undoStack, imageData]);
      };
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className={`min-h-screen p-4 ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between mb-4">
        <div className="space-x-2 flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTool('pencil')}
            className={tool === 'pencil' ? 'bg-blue-500' : ''}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTool('rectangle')}
            className={tool === 'rectangle' ? 'bg-blue-500' : ''}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTool('circle')}
            className={tool === 'circle' ? 'bg-blue-500' : ''}
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTool('eraser')}
            className={tool === 'eraser' ? 'bg-blue-500' : ''}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTool('text')}
            className={tool === 'text' ? 'bg-blue-500' : ''}
          >
            <Type className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-8"
            />
            <div className="w-32">
              <Slider
                value={[lineWidth]}
                min={1}
                max={20}
                step={1}
                onValueChange={([value]) => setLineWidth(value)}
              />
            </div>
          </div>
          
          <Button variant="outline" size="icon" onClick={undo}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={redo}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={saveDrawing}>
            <Save className="h-4 w-4" />
          </Button>
          <label>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={loadDrawing}
            />
            <Button variant="outline" size="icon" as="span">
              <Upload className="h-4 w-4" />
            </Button>
          </label>
        </div>
        
        <Input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
          className="w-32"
        />
        
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="w-64 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Layers</h3>
              <Button variant="outline" size="sm" onClick={() => {
                const newLayer = {
                  id: layers.length + 1,
                  name: `Layer ${layers.length + 1}`,
                  visible: true,
                  notes: [],
                  data: null
                };
                setLayers([...layers, newLayer]);
              }}>
                <Layers className="h-4 w-4" />
              </Button>
            </div>
            {layers.map(layer => (
              <div
                key={layer.id}
                className={`p-2 rounded ${activeLayer === layer.id ? 'bg-blue-500' : 'bg-gray-700'}`}
                onClick={() => setActiveLayer(layer.id)}
              >
                <div className="flex items-center justify-between">
                  <span>{layer.name}</span>
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => {
                      const updatedLayers = layers.map(l => 
                        l.id === layer.id ? {...l, visible: !l.visible} : l
                      );
                      setLayers(updatedLayers);
                    }}
                  />
                </div>
                <div className="mt-2">
                  {layer.notes.map(note => (
                    <div key={note.id} className="text-sm mt-1">
                      {note.text}
                    </div>
                  ))}
                  <Textarea
                    className="mt-2 w-full text-sm"
                    placeholder="Add note..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const updatedLayers = layers.map(l => {
                          if (l.id === layer.id) {
                            return {
                              ...l,
                              notes: [...l.notes, { id: Date.now(), text: e.target.value }]
                            };
                          }
                          return l;
                        });
                        setLayers(updatedLayers);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`border ${isDarkTheme ? 'border-gray-600' : 'border-gray-300'} rounded-lg`}
          />
        </div>
      </div>

      <Alert className="mt-4">
        <AlertDescription>
          Use mouse to draw freely. Select different tools from the toolbar.
          Press undo/redo to manage your changes.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DrawingApp;
