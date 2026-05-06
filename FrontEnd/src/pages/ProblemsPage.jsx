import React, { useState } from 'react'

import { PROBLEMS } from '../data/problems.js'
import { Link } from 'react-router'
import { ChevronRightIcon, Code2Icon, SearchIcon } from 'lucide-react'
import { getDifficultyBadgeClass } from '../lib/utils.js'


export const ProblemsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const allProblems = Object.values(PROBLEMS)
  const categories = ['All', ...new Set(allProblems.map(p => p.category))]

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
    <div className='min-h-screen bg-base-200'>
      <div className='max-w-7xl mx-auto px-4 py-12'>
        {/* HEADER */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Practice Problems</h1>
          <p className='text-base-content/70'>
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start'>
          {/* STATS SIDEBAR (Left Side, Vertical, Sticky) */}
          <aside className='lg:sticky lg:top-8 space-y-4'>
            <div className='card bg-base-100 shadow-xl border border-base-content/5'>
              <div className='card-body p-6'>
                <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
                  <div className='size-2 rounded-full bg-primary animate-pulse' />
                  Statistics
                </h3>
                <div className='space-y-6'>
                  <div className='flex items-center justify-between group'>
                    <div className='text-sm font-medium text-base-content/60'>Total Problems</div>
                    <div className='text-2xl font-bold text-primary group-hover:scale-110 transition-transform'>{problems.length}</div>
                  </div>
                  <div className='divider my-0 opacity-50' />
                  <div className='flex items-center justify-between group'>
                    <div className='text-sm font-medium text-base-content/60'>Easy</div>
                    <div className='text-xl font-bold text-success group-hover:scale-110 transition-transform'>{easyProblemsCount}</div>
                  </div>
                  <div className='flex items-center justify-between group'>
                    <div className='text-sm font-medium text-base-content/60'>Medium</div>
                    <div className='text-xl font-bold text-warning group-hover:scale-110 transition-transform'>{mediumProblemsCount}</div>
                  </div>
                  <div className='flex items-center justify-between group'>
                    <div className='text-sm font-medium text-base-content/60'>Hard</div>
                    <div className='text-xl font-bold text-error group-hover:scale-110 transition-transform'>{hardProblemsCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips or Info (Optional extra card for sidebar) */}
            <div className='card bg-primary/5 border border-primary/10'>
              <div className='card-body p-4 text-xs text-base-content/70 italic'>
                "Consistency is the key to mastering data structures and algorithms."
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT (Right Side) */}
          <main>
            {/* SEARCH & FILTERS */}
            <div className='flex flex-col md:flex-row gap-4 mb-8'>
              <div className='relative flex-1'>
                <SearchIcon className='absolute left-4 top-1/2 -translate-y-1/2 size-5 text-base-content/50' />
                <input 
                  type='text' 
                  placeholder='Search problems...' 
                  className='input input-bordered w-full pl-12 bg-base-100 shadow-sm focus:shadow-md transition-shadow'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className='flex gap-2'>
                <select 
                  className='select select-bordered bg-base-100 shadow-sm min-w-[140px]'
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value='All'>All Difficulties</option>
                  <option value='Easy'>Easy</option>
                  <option value='Medium'>Medium</option>
                  <option value='Hard'>Hard</option>
                </select>

                <select 
                  className='select select-bordered bg-base-100 shadow-sm min-w-[140px]'
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PROBLEMS LIST */}
            <div className='space-y-4'>
              {problems.length > 0 ? (
                problems.map((problem) => (
                  <Link
                    key={problem.id}
                    to={`/problem/${problem.id}`}
                    className='card bg-base-100 hover:scale-[1.01] hover:shadow-xl transition-all duration-300 border border-base-content/5'
                  >
                    <div className='card-body p-6'>
                      <div className='flex items-center justify-between gap-4'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-3 mb-2'>
                            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                              <Code2Icon className='size-6 text-primary' />
                            </div>
                            <div className='flex-1'>
                              <div className='flex items-center gap-2 mb-1'>
                                <h2 className='text-xl font-bold'>{problem.title}</h2>
                                <span className={`badge badge-sm font-bold ${getDifficultyBadgeClass(problem.difficulty)}`}>
                                  {problem.difficulty}
                                </span>
                              </div>
                              <p className='text-sm text-base-content/60'>{problem.category}</p>
                            </div>
                          </div>
                          <p className='text-base-content/80 mb-0 line-clamp-2'>{problem.description.text}</p>
                        </div>
                        <div className='flex items-center gap-2 text-primary font-bold group'>
                          <span className='hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity'>Solve</span>
                          <ChevronRightIcon className='size-6 translate-x-0 group-hover:translate-x-1 transition-transform' />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className='card bg-base-100 py-20 text-center border-2 border-dashed border-base-300'>
                  <div className='card-body items-center'>
                    <SearchIcon className='size-12 text-base-content/20 mb-4' />
                    <h3 className='text-xl font-bold'>No problems found</h3>
                    <p className='text-base-content/60'>Try adjusting your search query.</p>
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
