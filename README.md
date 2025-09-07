# AK Time Scheduler 📅

A visual time management application that transforms your day into 96 time blocks of 15 minutes each, helping you focus, set boundaries, and visualize your daily activities with color-coded tasks.

## 🎯 Project Goal

The AK Time Scheduler aims to revolutionize daily time management by:
- **Creating boundaries**: Dividing your day into manageable 15-minute blocks
- **Enhancing focus**: Visual representation helps you stay mindful of time allocation
- **Providing insights**: Heat map visualization shows productivity patterns
- **Enabling flexibility**: Easy task assignment and rearrangement
- **Supporting planning**: Export/import functionality for schedule templates

## ✨ Features

### Core Functionality
- **96 Time Blocks**: Each day is divided into 96 blocks of 15 minutes (4:00 AM to 4:00 AM operational day)
- **Visual Task Assignment**: Click to assign predefined tasks to time blocks
- **Multiple Selection**: Select individual or multiple blocks for batch assignment
- **Task Categories**: 8 predefined categories with distinct colors and emojis:
  - 🛌 Sleep (Dark Blue)
  - 🚀 Deep Work (Teal)
  - 💼 Work (Blue)
  - 📚 Study (Purple)
  - 🏃 Exercise (Red)
  - 🧾 Admin (Gray)
  - 🗣️ Meetings (Orange)
  - ☕ Break (Cyan)

### Interactive Features
- **Real-time Updates**: Live progress bar and current time block highlighting
- **Quick Assignment**: Click to assign, Shift+click to clear
- **Note Taking**: Double-click blocks to add custom notes
- **Keyboard Support**: Delete key to clear blocks, Enter for notes

### Data Management
- **Local Storage**: Automatic saving and loading of daily schedules
- **Export/Import**: JSON format for backing up and sharing schedules
- **Daily Navigation**: Previous/Next/Today buttons for easy date switching
- **Print View**: Dedicated print-friendly layout for A4 paper

### Visual Design
- **Modern UI**: Clean, card-based interface with subtle shadows and blur effects
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Responsive Design**: Adapts to different screen sizes
- **Time Visualization**: Progress bar shows day completion percentage
- **Category Totals**: Real-time calculation of hours spent per category

## 🛠️ Technology Stack

### Current Implementation
- **Pure HTML5**: Semantic markup with modern CSS Grid layout
- **Vanilla JavaScript**: No frameworks or dependencies
- **CSS3**: Advanced features including:
  - CSS Grid for responsive layout
  - CSS Variables for theming
  - Backdrop filters for modern glass effect
  - CSS animations for interactive feedback
- **Local Storage API**: Client-side data persistence
- **Web APIs**: File API for import/export functionality

### Future Roadmap
- **Migration to Blazor**: Planned transition to C# Blazor WebAssembly
- **Online Hosting**: Cloud deployment for cross-device synchronization
- **Enhanced Analytics**: Advanced reporting and insights
- **Team Features**: Shared schedules and collaboration tools

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ak-time-schedular.git
   cd ak-time-schedular
   ```

2. **Open in browser**:
   ```bash
   # Simply open index.html in your preferred browser
   open index.html  # macOS
   start index.html # Windows
   ```

3. **Start scheduling**:
   - Select a task category from the legend
   - Click on time blocks to assign tasks
   - Use Shift+click to clear assignments
   - Double-click blocks to add notes

## 📋 Usage Guide

### Basic Operations
- **Assign Tasks**: Select category, then click time blocks
- **Clear Assignments**: Shift+click on assigned blocks
- **Add Notes**: Double-click any block to add custom text
- **Navigate Days**: Use Prev/Today/Next buttons
- **View Totals**: Check bottom panel for time summaries

### Advanced Features
- **Export Schedule**: Save current day as JSON file
- **Import Schedule**: Load previously saved schedules
- **Print View**: Open print-friendly version for physical copies
- **Clear Day**: Reset entire day's assignments

### Keyboard Shortcuts
- **Delete**: Clear selected block
- **Enter**: Add/edit note for focused block
- **Tab**: Navigate between time blocks

## 🎨 Customization

The application uses CSS custom properties for easy theming:

```css
:root {
  --card-bg: rgba(255,255,255,0.65);
  --text: #0b1220;
  --bg: linear-gradient(135deg,#e8efff, #f6f9ff 35%, #fefefe);
}
```

Task categories can be modified in the `CATS` array in `script.js`:

```javascript
const CATS = [
  {id:'sleep', name:'Sleep', emoji:'🛌', color:'#1f3b73', cls:'cat-sleep'},
  // Add more categories...
];
```

## 🔧 What's Missing

### High Priority
- [ ] **Data Synchronization**: Cloud storage for cross-device access
- [ ] **Mobile Optimization**: Touch-friendly interface for mobile devices
- [ ] **Recurring Schedules**: Template system for weekly/daily patterns
- [ ] **Analytics Dashboard**: Visual reports and productivity insights

### Medium Priority
- [ ] **Drag & Drop**: More intuitive block assignment
- [ ] **Bulk Operations**: Select and assign multiple blocks at once
- [ ] **Custom Categories**: User-defined task types and colors
- [ ] **Time Zone Support**: Multi-timezone scheduling
- [ ] **Export Formats**: PDF, CSV, and other format options

### Low Priority
- [ ] **Collaboration**: Share schedules with team members
- [ ] **Integrations**: Calendar sync (Google, Outlook)
- [ ] **Notifications**: Browser alerts for task transitions
- [ ] **Themes**: Additional color schemes and layouts

## 📄 File Structure

```
ak-time-schedular/
├── index.html          # Main application interface
├── script.js           # Core application logic
├── print.html          # Print-friendly view (implied)
├── CLAUDE.md           # Project instructions and context
└── README.md           # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes following the existing code style
4. Test thoroughly across different browsers
5. Submit a pull request with a clear description

## 📜 License

This project is open source. Please check the repository for license details.

## 🐛 Known Issues

- Print functionality requires popup permission
- Local storage is limited to single device
- No data backup/recovery mechanism
- Mobile touch experience could be improved

---

**Made with ❤️ for better time management**
