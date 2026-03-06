import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  PanResponder,
  Dimensions,
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

const DrawingCanvas = ({ visible, onClose, exampleHtml, color }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentTool, setCurrentTool] = useState('brush'); // 'brush' or 'eraser'

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath((prev) => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        if (currentPath.length > 0) {
          setPaths((prev) => [
            ...prev,
            {
              points: currentPath,
              color: currentTool === 'brush' ? '#333' : '#FFFFFF',
              width: currentTool === 'brush' ? 3 : 20,
              isEraser: currentTool === 'eraser',
            },
          ]);
          setCurrentPath([]);
        }
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
          <TouchableOpacity style={styles.headerButton} onPress={handleClear}>
            <Text style={styles.headerButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Canvas Area */}
        <View style={styles.canvasContainer} {...panResponder.panHandlers}>
          {/* Background with Example Text */}
          <View style={styles.exampleBackground} pointerEvents="none">
            <ExampleHighlight html={exampleHtml} color={color} />
          </View>

          {/* Drawing Layer */}
          <Svg style={styles.svg}>
            <G>
              {paths.map((path, index) => (
                <Path
                  key={index}
                  d={createPathData(path.points)}
                  stroke={path.color}
                  strokeWidth={path.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {currentPath.length > 0 && (
                <Path
                  d={createPathData(currentPath)}
                  stroke={currentTool === 'brush' ? '#333' : '#FFFFFF'}
                  strokeWidth={currentTool === 'brush' ? 3 : 20}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
            </G>
          </Svg>
        </View>

        {/* Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[styles.toolButton, currentTool === 'brush' && styles.toolButtonActive]}
            onPress={() => setCurrentTool('brush')}
          >
            <Text style={[styles.toolIcon, currentTool === 'brush' && styles.toolIconActive]}>
              ✏️
            </Text>
            <Text style={[styles.toolLabel, currentTool === 'brush' && styles.toolLabelActive]}>
              Brush
            </Text>
          </TouchableOpacity>

          <View style={styles.toolDivider} />

          <TouchableOpacity
            style={[styles.toolButton, currentTool === 'eraser' && styles.toolButtonActive]}
            onPress={() => setCurrentTool('eraser')}
          >
            <Text style={[styles.toolIcon, currentTool === 'eraser' && styles.toolIconActive]}>
              🧼
            </Text>
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
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 20,
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
    fontSize: 32,
    color: '#333',
    lineHeight: 44,
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
