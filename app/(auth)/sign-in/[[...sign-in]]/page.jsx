import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-gray-50">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Section Gauche avec Image */}
        <section className="relative flex h-32 items-end bg-green-500 lg:col-span-5 lg:h-full xl:col-span-6">
        <img
        alt=""
        src="https://img.freepik.com/free-photo/computer-monitor-with-graph-it_1340-35876.jpg?t=st=1713637770~exp=1713641370~hmac=3ca8ac7a49cb9bd87daa1588c958cd44f5ad4b42473673520a11c0bda5fa3894&w=1060"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
          <div className="hidden lg:relative lg:block lg:p-12">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              Save Your Money 💰
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Start managing your budget today and watch your savings grow!
            </p>
          </div>
        </section>

        {/* Section Droite pour Se Connecter */}
        <main className="flex items-center justify-center px-8 py-12 sm:px-12 lg:col-span-7 lg:px-16 xl:col-span-6 bg-white">
          <div className="max-w-xl lg:max-w-3xl">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex size-16 items-center justify-center rounded-full bg-pink-400 text-white shadow-md">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2H2v2h2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8h2V9h-2zm-2 10H6v-8h12v8zm-5-3H9v-2h4v2z" />
                </svg>
              </div>
              <h1 className="ml-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Expense Saver 🐷
              </h1>
            </div>

            {/* Texte d'Accueil */}
            <h2 className="text-2xl font-semibold text-gray-700 sm:text-3xl">
            Welcome Back 👋
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to start tracking expenses and growing your savings.
            </p>

            {/* Formulaire de Connexion */}
            <div className="mt-8">
              <SignIn />
            </div>

            {/* CTA */}
            <p className="mt-8 text-center text-gray-600">
              New here?{" "}
              <a
                href="/sign-up"
                className="text-pink-500 hover:underline font-semibold"
              >
                Create an account
              </a>
            </p>
          </div>
        </main>
      </div>
    </section>
  );
}
