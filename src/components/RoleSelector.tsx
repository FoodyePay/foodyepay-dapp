type Props = {
    role: 'diner' | 'restaurant'
    setRole: (role: 'diner' | 'restaurant') => void
  }
  
  export default function RoleSelector({ role, setRole }: Props) {
    return (
      <div className="flex gap-4">
        <button
          onClick={() => setRole('diner')}
          className={`px-6 py-2 rounded-lg ${role === 'diner' ? 'bg-green-600' : 'bg-gray-700'}`}
        >
          I'm a Diner
        </button>
        <button
          onClick={() => setRole('restaurant')}
          className={`px-6 py-2 rounded-lg ${role === 'restaurant' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          I'm a Restaurant
        </button>
      </div>
    )
  }
  