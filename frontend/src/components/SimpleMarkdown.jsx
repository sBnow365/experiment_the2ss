import ReactMarkdown from 'react-markdown';

export default function SimpleMarkdown({ content }) {
  // Inline styles keep it self-contained and "minimal"
  const styles = {
    container: {
      lineHeight: '1.6',
      fontFamily: 'sans-serif',
      color: '#ffffff',
      maxWidth: '800px',
      margin: '20px auto',
      padding: '0 20px'
    }
  };

  return (
    <div style={styles.container} className="markdown-body">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}