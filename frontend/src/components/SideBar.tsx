import { LayoutDashboard, LogOut, Users } from 'lucide-react';

interface SideBarProps {
    onLogout: () => void;
}

const SideBar = ({ onLogout }: SideBarProps) => {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-black border-r border-gray-800 text-gray-300">
            <div className="flex items-center justify-center h-16 border-b border-gray-800">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-white" />
                    Lead CRM
                </h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    <li>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg transition-colors">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-800">
                <button onClick={onLogout} className="flex items-center gap-3 px-4 py-2 w-full text-left text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default SideBar;
