import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  PanResponder,
  Dimensions,
  Image,
} from 'react-native';
import Svg, { Path, G, Rect, Mask, Defs } from 'react-native-svg';

const { width: canvasWidth, height: canvasHeight } = Dimensions.get('window');

const BRUSH_COLOR = '#E53935'; // Red color for brush
const ERASER_SIZE = 30;
const BRUSH_SIZE = 6;

// Example Highlight Component for Canvas
const ExampleHighlight = ({ html, color }) => {
  const parseExample = (htmlString) => {
    const segments = [];
    let currentText = '';
    const tagStack = [];

    let i = 0;
    while (i < htmlString.length) {
      if (htmlString[i] === '<') {
        if (currentText) {
          const inPattern = tagStack.includes('pattern');
          const inHighlight = tagStack.includes('highlight');
          segments.push({ text: currentText, isHighlight: inHighlight, isPattern: inPattern });
          currentText = '';
        }

        const endIndex = htmlString.indexOf('>', i);
        if (endIndex === -1) break;

        const tag = htmlString.substring(i + 1, endIndex);
        if (tag === 'span class="highlight"' || tag === 'span class=\'highlight\'') {
          tagStack.push('highlight');
        } else if (tag === 'span class="pattern"' || tag === 'span class=\'pattern\'') {
          tagStack.push('pattern');
        } else if (tag === '/span') {
          tagStack.pop();
        }

        i = endIndex + 1;
      } else {
        currentText += htmlString[i];
        i++;
      }
    }

    if (currentText) {
      const inPattern = tagStack.includes('pattern');
      const inHighlight = tagStack.includes('highlight');
      segments.push({ text: currentText, isHighlight: inHighlight, isPattern: inPattern });
    }

    return segments;
  };

  const segments = parseExample(html);

  return (
    <View style={styles.exampleContainer}>
      <View style={styles.exampleTextContainer}>
        {segments.map((segment, index) => (
          <Text
            key={index}
            style={[
              styles.exampleText,
              segment.isPattern && { color: color, fontWeight: 'bold' },
              segment.isHighlight && !segment.isPattern && { fontWeight: '600' },
            ]}
          >
            {segment.text}
          </Text>
        ))}
      </View>
    </View>
  );
};

// Calculate distance between a point and a line segment
const distanceToSegment = (px, py, x1, y1, x2, y2) => {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;

  return Math.sqrt(dx * dx + dy * dy);
};

// Check if eraser at (ex, ey) intersects with a path segment
const eraserIntersectsSegment = (ex, ey, p1, p2, eraserRadius) => {
  return distanceToSegment(ex, ey, p1.x, p1.y, p2.x, p2.y) < eraserRadius;
};

// Erase parts of paths that are within eraser range
// Returns array of new paths (split if needed)
const erasePaths = (paths, eraserX, eraserY, eraserRadius) => {
  const newPaths = [];

  paths.forEach((path) => {
    const points = path.points;
    if (points.length === 0) return;

    let currentSegment = [];
    const segments = [];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      let isErased = false;

      // Check if this point is within eraser radius
      const distToEraser = Math.sqrt(
        Math.pow(point.x - eraserX, 2) + Math.pow(point.y - eraserY, 2)
      );

      if (distToEraser < eraserRadius) {
        isErased = true;
      } else if (i > 0) {
        // Check if line segment from prev point to current point intersects eraser
        if (eraserIntersectsSegment(eraserX, eraserY, points[i - 1], point, eraserRadius)) {
          isErased = true;
        }
      }

      if (isErased) {
        // End current segment if it has points
        if (currentSegment.length > 0) {
          segments.push([...currentSegment]);
          currentSegment = [];
        }
      } else {
        currentSegment.push(point);
      }
    }

    // Don't forget the last segment
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }

    // Create new path objects from segments
    segments.forEach((segment) => {
      if (segment.length > 1) {
        newPaths.push({
          points: segment,
          color: path.color,
          width: path.width,
          id: Date.now() + Math.random(),
        });
      }
    });
  });

  return newPaths;
};

const DrawingCanvas = ({ visible, onClose, exampleHtml, color }) => {
  const [paths, setPaths] = useState([]);
  const [history, setHistory] = useState([]); // Store history for undo
  const [currentPath, setCurrentPath] = useState([]);
  const [currentTool, setCurrentTool] = useState('brush'); // 'brush' or 'eraser'
  const canvasLayout = useRef(null);

  // Save current state to history
  const saveToHistory = useCallback((currentPaths) => {
    setHistory((prev) => {
      const newHistory = [...prev, currentPaths];
      // Keep only last 20 states to prevent memory issues
      if (newHistory.length > 20) {
        return newHistory.slice(newHistory.length - 20);
      }
      return newHistory;
    });
  }, []);

  // Undo last action
  const handleUndo = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const newHistory = prevHistory.slice(0, -1);
      const previousState = newHistory[newHistory.length - 1] || [];
      setPaths(previousState);
      return newHistory;
    });
  }, []);

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const point = { x: locationX, y: locationY };
        setCurrentPath([point]);

        // If using eraser, immediately check for paths to erase
        if (currentTool === 'eraser') {
          setPaths((prevPaths) =>
            erasePaths(prevPaths, point.x, point.y, ERASER_SIZE / 2)
          );
        }
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const point = { x: locationX, y: locationY };

        if (currentTool === 'brush') {
          setCurrentPath((prev) => [...prev, point]);
        } else if (currentTool === 'eraser') {
          // Erase paths that are near the current point
          setPaths((prevPaths) =>
            erasePaths(prevPaths, point.x, point.y, ERASER_SIZE / 2)
          );
          setCurrentPath((prev) => [...prev, point]);
        }
      },
      onPanResponderRelease: () => {
        if (currentTool === 'brush' && currentPath.length > 0) {
          const newPath = {
            points: currentPath,
            color: BRUSH_COLOR,
            width: BRUSH_SIZE,
            id: Date.now(),
          };
          // Save current state to history before adding new path
          saveToHistory(paths);
          setPaths((prev) => [...prev, newPath]);
        }
        setCurrentPath([]);
      },
    });
  }, [currentPath, currentTool]);

  const createPathData = useCallback((points) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  }, []);

  const handleClear = () => {
    saveToHistory(paths);
    setPaths([]);
    setCurrentPath([]);
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
            <Text style={styles.headerButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Practice Writing</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.headerButton, history.length === 0 && styles.headerButtonDisabled]}
              onPress={handleUndo}
              disabled={history.length === 0}
            >
              <Text style={[styles.headerButtonText, history.length === 0 && styles.headerButtonTextDisabled]}>
                ↩️
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleClear}>
              <Text style={styles.headerButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Canvas Area */}
        <View
          style={styles.canvasContainer}
          {...panResponder.panHandlers}
          onLayout={(event) => {
            canvasLayout.current = event.nativeEvent.layout;
          }}
        >
          {/* Background with Example Text */}
          <View style={styles.exampleBackground} pointerEvents="none">
            <ExampleHighlight html={exampleHtml} color={color} />
          </View>

          {/* Drawing Layer */}
          <Svg style={styles.svg} width="100%" height="100%">
            <Defs>
              <Mask id="eraserMask">
                <Rect x="0" y="0" width="100%" height="100%" fill="white" />
              </Mask>
            </Defs>
            <G>
              {paths.map((path) => (
                <Path
                  key={path.id}
                  d={createPathData(path.points)}
                  stroke={path.color}
                  strokeWidth={path.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {currentTool === 'brush' && currentPath.length > 0 && (
                <Path
                  d={createPathData(currentPath)}
                  stroke={BRUSH_COLOR}
                  strokeWidth={BRUSH_SIZE}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
            </G>
            {/* Eraser cursor indicator */}
            {currentTool === 'eraser' && currentPath.length > 0 && (
              <Rect
                x={currentPath[currentPath.length - 1]?.x - ERASER_SIZE / 2}
                y={currentPath[currentPath.length - 1]?.y - ERASER_SIZE / 2}
                width={ERASER_SIZE}
                height={ERASER_SIZE}
                fill="rgba(100, 100, 100, 0.2)"
                stroke="rgba(100, 100, 100, 0.4)"
                strokeWidth={1}
                rx={4}
              />
            )}
          </Svg>
        </View>

        {/* Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[styles.toolButton, currentTool === 'brush' && styles.toolButtonActive]}
            onPress={() => setCurrentTool('brush')}
          >
            <Image
              source={require('../../assets/images/icon-brush.png')}
              style={[styles.toolIconImage, currentTool === 'brush' && styles.toolIconImageActive]}
            />
            <Text style={[styles.toolLabel, currentTool === 'brush' && styles.toolLabelActive]}>
              Brush
            </Text>
          </TouchableOpacity>

          <View style={styles.toolDivider} />

          <TouchableOpacity
            style={[styles.toolButton, currentTool === 'eraser' && styles.toolButtonActive]}
            onPress={() => setCurrentTool('eraser')}
          >
            <Image
              source={require('../../assets/images/icon-eraser.png')}
              style={[styles.toolIconImage, currentTool === 'eraser' && styles.toolIconImageActive]}
            />
            <Text style={[styles.toolLabel, currentTool === 'eraser' && styles.toolLabelActive]}>
              Eraser
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9E7', // Light paper color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.6,
  },
  headerButtonText: {
    fontSize: 20,
  },
  headerButtonTextDisabled: {
    opacity: 0.4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'SassoonPrimary',
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
  },
  exampleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  exampleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exampleTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exampleText: {
    fontSize: 64, // Further increased for better visibility
    color: '#333',
    lineHeight: 84,
    fontFamily: 'SassoonPrimary',
  },
  svg: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 32,
  },
  toolButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
  },
  toolButtonActive: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  toolIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  toolIconImage: {
    width: 28,
    height: 28,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  toolIconImageActive: {
    opacity: 1,
  },
  toolIconActive: {
    opacity: 1,
  },
  toolLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'SassoonPrimary',
  },
  toolLabelActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  toolDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
});

export default DrawingCanvas;
