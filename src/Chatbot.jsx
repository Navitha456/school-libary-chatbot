import { useEffect, useRef, useState } from 'react'
import './Chatbot.css'

const books = [
  { title: "Charlotte's Web", author: 'E. B. White', category: 'Story', keywords: ['friendship', 'animals', 'short'] },
  { title: 'Matilda', author: 'Roald Dahl', category: 'Story', keywords: ['funny', 'magic', 'adventure'] },
  { title: 'The Wild Robot', author: 'Peter Brown', category: 'Adventure', keywords: ['robot', 'animals', 'adventure'] },
  { title: 'Wonder', author: 'R. J. Palacio', category: 'Story', keywords: ['friendship', 'kindness', 'school'] },
  { title: 'National Geographic Kids: Space', author: 'National Geographic Kids', category: 'Science', keywords: ['science', 'space', 'planets'] },
  { title: 'The Magic Tree House: Dinosaurs Before Dark', author: 'Mary Pope Osborne', category: 'Adventure', keywords: ['dinosaurs', 'history', 'short'] },
  { title: 'Diary of a Wimpy Kid', author: 'Jeff Kinney', category: 'Funny', keywords: ['funny', 'school', 'short'] },
  { title: 'A First Book of the Sea', author: 'Nicola Davies', category: 'Nature', keywords: ['science', 'animals', 'ocean'] },
]

const quickQuestions = ['Suggest a book', 'Find a science book', 'I want a short book']

function getReply(question) {
  const text = question.toLowerCase()

  if (/\b(hello|hi|hey)\b/.test(text)) {
    return { text: "Hello! I can help you find a book or answer general library questions. What would you like to read?" }
  }

  if (/\b(hours|open|closed|closing)\b/.test(text)) {
    return { text: "Library hours can change by school and day. Please check the library noticeboard or ask the librarian for today's hours." }
  }

  if (/\b(borrow|loan|return|renew|due date|overdue)\b/.test(text)) {
    return { text: 'Borrowing and return rules vary by school. Bring your book or student ID to the library desk and the librarian can check your due date or renew it.' }
  }

  let matches = books.filter((book) => text.includes(book.title.toLowerCase()))
  if (!matches.length && /\b(short|quick|little)\b/.test(text)) {
    matches = books.filter((book) => book.keywords.includes('short'))
  }
  if (!matches.length) {
    matches = books.filter((book) => [book.category.toLowerCase(), ...book.keywords].some((word) => text.includes(word)))
  }
  if (!matches.length && /\b(popular|best|recommend|suggest|book|read)\b/.test(text)) {
    matches = books.slice(0, 3)
  }

  if (matches.length) {
    return {
      text: matches.length === 1 ? 'This book might be a good match:' : 'Here are a few books you might enjoy:',
      books: matches.slice(0, 3),
    }
  }

  return { text: 'I can suggest books by topic, like science, animals, funny stories, or adventure. You can also ask about borrowing, returning, or library hours.' }
}

function Chatbot() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm your school library helper. Ask me to find a book, suggest a topic, or help with borrowing." },
  ])
  const endOfMessages = useRef(null)

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  function askLibrary(question) {
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return

    setMessages((current) => [
      ...current,
      { from: 'you', text: cleanQuestion },
      { from: 'bot', ...getReply(cleanQuestion) },
    ])
    setInput('')
  }

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="School library home">
          <span className="brand-icon" aria-hidden="true">L</span>
          <span><strong>School Library</strong><small>Reading help for every student</small></span>
        </a>
        <span className="open-status"><span aria-hidden="true" /> Ready to help</span>
      </header>

      <section className="chat-layout" id="home" aria-labelledby="page-title">
        <div className="welcome">
          <p className="eyebrow">YOUR FRIENDLY LIBRARY HELPER</p>
          <h1 id="page-title">What would you like to read?</h1>
          <p>Find a story, explore a topic, or get help with library basics.</p>
        </div>

        <section className="chat-panel" aria-label="Chat with the school library helper">
          <div className="chat-heading">
            <div className="librarian-avatar" aria-hidden="true">L</div>
            <div><h2>Library helper</h2><p>Ask about books and reading</p></div>
          </div>

          <div className="message-list" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div className={`message-row ${message.from}`} key={`${message.from}-${index}`}>
                {message.from === 'bot' && <span className="message-avatar" aria-hidden="true">L</span>}
                <div className="message-content">
                  <p className="message-bubble">{message.text}</p>
                  {message.books?.length > 0 && (
                    <div className="book-suggestions">
                      {message.books.map((book) => (
                        <article className="book-suggestion" key={book.title}>
                          <span className="book-mark" aria-hidden="true">Aa</span>
                          <div><h3>{book.title}</h3><p>{book.author} <span>·</span> {book.category}</p></div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endOfMessages} />
          </div>

          <div className="chat-compose">
            <p className="prompt-label">Try asking</p>
            <div className="quick-questions">
              {quickQuestions.map((question) => (
                <button key={question} type="button" onClick={() => askLibrary(question)}>{question}</button>
              ))}
            </div>
            <form className="message-form" onSubmit={(event) => { event.preventDefault(); askLibrary(input) }}>
              <label className="visually-hidden" htmlFor="chat-input">Your question</label>
              <input id="chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your question..." />
              <button type="submit" aria-label="Send message" disabled={!input.trim()}><span aria-hidden="true">↑</span></button>
            </form>
            <p className="local-note">For school-specific rules, please check with your librarian.</p>
          </div>
        </section>
      </section>

      <footer className="site-footer">A good book can take you anywhere.</footer>
    </main>
  )
}

export default Chatbot