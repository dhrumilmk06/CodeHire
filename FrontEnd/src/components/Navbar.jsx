import { Link, useLocation } from 'react-router'
import { BookOpenIcon, LayoutDashboardIcon, LibraryIcon, SparklesIcon } from "lucide-react"
import { UserButton } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

export const Navbar = () => {

    const location = useLocation();

    const isActive = (path) => location.pathname === path

    const navItems = [
        { path: "/problems", label: "Problems", icon: BookOpenIcon },
        { path: "/problem-bank", label: "Problem Bank", icon: LibraryIcon },
        { path: "/dashboard", label: "DashBoard", icon: LayoutDashboardIcon },
    ]

    return (
        <nav className='bg-bse-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg'>
            <div className='max-w-7xl mx-auto p-4 flex items-center justify-between'>
                {/* LOGO */}
                <Link
                    to='/'
                    className='group flex items-center gap-3 hover:scale-105 transition-transform duration-200'
                >
                    <div className='size-10 rounded-xl bg-linear-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg'>
                        <SparklesIcon className='size-6 text-white' />
                    </div>

                    <div className="flex flex-col">
                        <span className="font-black text-xl bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                            CodeHire
                        </span>
                        <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
                    </div>
                </Link>

                <div className='flex items-center gap-1'>
                    {/* NAV TABS WITH SLIDING PILL */}
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className='relative px-4 py-2.5 rounded-lg'
                        >
                            {/* Animated green pill background */}
                            {isActive(item.path) && (
                                <motion.div
                                    layoutId="nav-active-pill"
                                    className="absolute inset-0 bg-primary rounded-lg"
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}

                            {/* Tab content (always on top of the pill) */}
                            <div className={`relative z-10 flex items-center gap-x-2.5 ${isActive(item.path)
                                ? "text-primary-content"
                                : "text-base-content/70 hover:text-base-content"
                                }`}>
                                <item.icon className='size-4' />
                                <span className='font-medium hidden sm:inline'>{item.label}</span>
                            </div>
                        </Link>
                    ))}

                    <div className='ml-4 mt-2'>
                        <UserButton />
                    </div>

                </div>

            </div>
        </nav>
    )
}
