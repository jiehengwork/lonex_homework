function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure className="px-10 pt-10">
          <img src="/vite.svg" alt="Vite" className="rounded-xl w-24 h-24" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-primary">React + Vite + DaisyUI</h2>
          <p className="text-base-content/80">
            Tailwind CSS and DaisyUI are successfully configured!
          </p>
          <div className="card-actions mt-4">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-outline btn-secondary">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
