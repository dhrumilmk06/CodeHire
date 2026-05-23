import React, { useState } from 'react'

import { PROBLEMS } from '../data/problems.js'
import { Link } from 'react-router'
import { ChevronRightIcon, Code2Icon, SearchIcon } from 'lucide-react'
import { getDifficultyBadgeClass } from '../lib/utils.js'
import { SkeletonCard } from '../components/ui/SkeletonCard'


export const ProblemsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const allProblems = Object.values(PROBLEMS)
  const categories = ['All', ...new Set(allProblems.map(p => p.category))]

  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const filteredProblems = allProblems.filter(problem => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = problem.title.toLowerCase().includes(searchLower) ||
      problem.category.toLowerCase().includes(searchLower) ||
      problem.description.text.toLowerCase().includes(searchLower)
    
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === 'All' || problem.category === categoryFilter

    return matchesSearch && matchesDifficulty && matchesCategory
  })

  // Use allProblems for the total stats, or filteredProblems? 
  // Let's use allProblems for the counts so they stay constant, or filtered?
  // Usually, stats reflect the total available unless specifically asked for "filtered stats".
  // Let's stick to the current behavior where stats reflect the displayed list.
  const problems = filteredProblems 

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length
  return (
    <div className='min-h-screen bg-base-300'>
      {/* Hero Header Section */}
      <div className="bg-linear-to-b from-primary/10 via-base-200 to-base-300">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12'>
          <div className='text-center sm:text-left'>
            <h1 className='text-3xl sm:text-4xl font-bold mb-2'>Practice Problems</h1>
            <p className='text-sm sm:text-base text-base-content/70'>
              Sharpen your coding skills with these curated problems
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 sm:gap-8 items-start'>
          {/* STATS SIDEBAR (Left Side, Vertical, Sticky) */}
          <aside className='lg:sticky lg:top-8 space-y-4 order-2 lg:order-1'>
            <div className='card bg-base-100 shadow-xl border border-base-content/5'>
              <div className='card-body p-4 sm:p-6'>
                <h3 className='text-base sm:text-lg font-bold mb-4 flex items-center gap-2'>
                  <div className='size-2 rounded-full bg-primary animate-pulse' />
                  Statistics
                </h3>
                <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-4 lg:gap-6'>
                  <div className='flex items-center justify-between group'>
                    <div className='text-xs sm:text-sm font-medium text-base-content/60'>Total</div>
                    <div className='text-xl sm:text-2xl font-bold text-primary group-hover:scale-110 transition-transform'>{problems.length}</div>
                  </div>
                  <div className='hidden lg:block divider my-0 opacity-50' />
                  <div className='flex items-center justify-between group'>
                    <div className='text-xs sm:text-sm font-medium text-base-content/60'>Easy</div>
                    <div className='text-lg sm:text-xl font-bold text-success group-hover:scale-110 transition-transform'>{easyProblemsCount}</div>
                  </div>
                  <div className='flex items-center justify-between group'>
                    <div className='text-xs sm:text-sm font-medium text-base-content/60'>Medium</div>
                    <div className='text-lg sm:text-xl font-bold text-warning group-hover:scale-110 transition-transform'>{mediumProblemsCount}</div>
                  </div>
                  <div className='flex items-center justify-between group'>
                    <div className='text-xs sm:text-sm font-medium text-base-content/60'>Hard</div>
                    <div className='text-lg sm:text-xl font-bold text-error group-hover:scale-110 transition-transform'>{hardProblemsCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips or Info (Optional extra card for sidebar) */}
            <div className='card bg-primary/5 border border-primary/10 hidden sm:block'>
              <div className='card-body p-4 text-xs text-base-content/70 italic'>
                "Consistency is the key to mastering data structures and algorithms."
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT (Right Side) */}
          <main className='order-1 lg:order-2'>
            {/* SEARCH & FILTERS */}
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8'>
              <div className='relative flex-1'>
                <SearchIcon className='absolute left-4 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-base-content/50' />
                <input 
                  type='text' 
                  placeholder='Search problems...' 
                  className='input input-bordered w-full pl-10 sm:pl-12 bg-base-100 shadow-sm focus:shadow-md transition-shadow text-sm sm:text-base'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className='flex gap-2'>
                <select 
                  className='select select-bordered bg-base-100 shadow-sm flex-1 sm:min-w-[140px] text-sm sm:text-base'
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value='All'>Difficulties</option>
                  <option value='Easy'>Easy</option>
                  <option value='Medium'>Medium</option>
                  <option value='Hard'>Hard</option>
                </select>

                <select 
                  className='select select-bordered bg-base-100 shadow-sm flex-1 sm:min-w-[140px] text-sm sm:text-base'
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PROBLEMS GRID */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} variant="problem" />
                ))
              ) : problems.length > 0 ? (
                problems.map((problem) => (
                  <Link
                    key={problem.id}
                    to={`/problem/${problem.id}`}
                    className='card bg-base-100 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 border border-base-content/5 group'
                  >
                    <div className='card-body p-4 sm:p-5'>
                      <div className='flex flex-col h-full'>
                        <div className='flex items-start justify-between gap-3 mb-3'>
                          <div className='size-10 sm:size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0'>
                            <Code2Icon className='size-5 sm:size-6 text-primary' />
                          </div>
                          <div className='flex flex-col items-end min-w-0'>
                             <span className={`badge badge-xs sm:badge-sm font-bold ${getDifficultyBadgeClass(problem.difficulty)} mb-1`}>
                                {problem.difficulty}
                              </span>
                             <p className='text-[10px] sm:text-xs text-base-content/50 font-medium truncate w-full text-right' title={problem.category}>
                                {problem.category}
                             </p>
                          </div>
                        </div>
                        
                        <div className='flex-1 mb-4'>
                          <h2 className='text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1'>{problem.title}</h2>
                          <p className='text-xs sm:text-sm text-base-content/70 line-clamp-2 sm:line-clamp-3'>{problem.description.text}</p>
                        </div>

                        <div className='flex items-center justify-between pt-4 border-t border-base-content/5 mt-auto'>
                           <div className='flex items-center gap-1 text-primary font-bold text-xs sm:text-sm'>
                              <span>Solve Problem</span>
                           </div>
                           <ChevronRightIcon className='size-5 text-primary group-hover:translate-x-1 transition-transform' />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className='col-span-full card bg-base-100 py-16 sm:py-20 text-center border-2 border-dashed border-base-300'>
                  <div className='card-body items-center'>
                    <SearchIcon className='size-10 sm:size-12 text-base-content/20 mb-4' />
                    <h3 className='text-lg sm:text-xl font-bold'>No problems found</h3>
                    <p className='text-xs sm:text-sm text-base-content/60'>Try adjusting your search query.</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
