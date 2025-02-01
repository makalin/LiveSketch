# LiveSketch

LiveSketch is a modern web-based drawing application that allows users to create, edit, and save artwork with ease. With support for multiple layers, various tools, and dark/light themes, LiveSketch is perfect for both casual and professional users.

---

## Features

- **Drawing Tools:**
  - Pencil
  - Rectangle
  - Circle
  - Text
  - Eraser
- **Customization:**
  - Choose your preferred colors and adjust line widths
  - Toggle between light and dark themes
- **Layer Management:**
  - Add, remove, and toggle the visibility of layers
  - Add notes to specific layers for better organization
- **Undo/Redo:**
  - Keep your workflow smooth with undo and redo functionality
- **Save and Load:**
  - Save your artwork as PNG files
  - Load existing images to continue working
- **Real-Time Collaboration (Coming Soon):**
  - Connect to rooms using unique Room IDs

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/makalin/LiveSketch.git
   cd LiveSketch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Usage

1. **Drawing:**
   - Select a tool from the toolbar.
   - Adjust color and line width as needed.
   - Use the canvas to draw freely.

2. **Layers:**
   - Add new layers for separate elements.
   - Toggle visibility or select a layer to make it active.
   - Add notes to layers for detailed descriptions.

3. **Saving and Loading:**
   - Save your drawing using the save button.
   - Load an image from your local storage to continue editing.

4. **Undo/Redo:**
   - Use undo and redo buttons to manage changes.

---

## Technologies Used

- **Frontend:** React, TypeScript
- **UI Components:** Custom components and Lucide React icons
- **Canvas Rendering:** HTML5 Canvas API

---

## Future Enhancements

- Real-time collaboration with WebSocket integration
- Advanced shape tools (polygon, line, etc.)
- Export in multiple formats (JPEG, SVG, etc.)
- Layer grouping and advanced editing

---

## Contributing

We welcome contributions! Please fork the repository and submit a pull request for review.

1. Fork the project
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a pull request

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments

- [Lucide React](https://lucide.dev/) for the beautiful icon library.
- The open-source community for their continuous support and contributions.
