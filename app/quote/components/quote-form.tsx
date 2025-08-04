'use client'

import { useState } from 'react'
import { questions } from '../lib/questions'
import { HelpCircle, ChevronLeft, Info, Check, MessageCircle, Phone, PhoneCall } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AddressSearch from './address-search'

interface Address {
  address_line_1: string
  address_line_2?: string
  town_or_city: string
  county?: string
  postcode: string
  formatted_address: string
}

export default function QuoteForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [showAddressSearch, setShowAddressSearch] = useState(false)

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
    
    // Auto-advance to next step or show address search
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
      setSelectedAnswer('')
    } else {
      // All questions completed, show address search
      setShowAddressSearch(true)
      setSelectedAnswer('')
    }
  }

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address)
  }

  const handleBack = () => {
    if (showAddressSearch) {
      setShowAddressSearch(false)
      setSelectedAnswer('')
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setSelectedAnswer('')
    }
  }

  const handleOptionClick = (value: string) => {
    setSelectedAnswer(value)
    handleAnswer(questions[currentStep].id, value)
  }

  const currentQuestion = questions[currentStep]
  const progress = showAddressSearch ? 100 : ((currentStep + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <span className="text-lg sm:text-xl font-semibold text-black">Origin</span>
            </div>

            {/* Help Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-black text-white px-3 sm:px-4 py-2 rounded-full flex items-center space-x-2 text-sm sm:text-base hover:bg-gray-800 transition-colors">
                  <span>Help</span>
                  <HelpCircle size={14} className="sm:w-4 sm:h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-74 p-0 bg-gray-100 border-gray-200" align="end">
                <div className="p-4 space-y-2">
                  {/* Chat with us */}
                  <div className="flex items-start space-x-3 rounded-lg transition-colors cursor-pointer py-2 items-center">
                    <div className="w-12 h-12 highlight-bg-transparent rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 highlight-text" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm">Chat with us</p>
                      <p className="text-black font-semibold underline">Start chat</p>
                    </div>
                  </div>

                  {/* We'll call you */}
                  <div className="flex items-start space-x-3 rounded-lg transition-colors cursor-pointer py-2 items-center">
                    <div className="w-12 h-12 highlight-bg-transparent rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 highlight-text" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm">We'll call you</p>
                      <p className="text-black font-semibold underline">Request callback</p>
                    </div>
                  </div>

                  {/* Speak to our team */}
                  <div className="bg-white rounded-lg px-4 py-3">
                    <div className="flex items-start space-x-3">
                     
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm">Speak to our team</p>
                        <p className="text-black font-semibold text-lg underline">0330 113 1333</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-2 h-2 highlight-bg rounded-full"></div>
                          <span className="text-gray-500 text-xs">Lines are open</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 h-1">
              <motion.div 
                className="highlight-bg h-1"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start sm:justify-center px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
          
          {showAddressSearch ? (
            /* Address Search */
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black leading-tight">
                  What's your address?
                </h1>
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl">
                  Enter your postcode to find your address
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Question */
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-3 sm:space-y-4 text-center"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black leading-tight">
                  {currentQuestion.question}
                </h1>
                
                {currentQuestion.hint && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="text-gray-600 text-base sm:text-lg lg:text-xl"
                  >
                    {currentQuestion.hint}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {showAddressSearch ? (
            /* Address Search Component */
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-md mx-auto"
              >
                <AddressSearch onAddressSelect={handleAddressSelect} />
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Options */
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Options Grid */}
                <div className={`${currentQuestion.options.some(opt => opt.image) ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4' : 'space-y-3 sm:space-y-4 max-w-md mx-auto'}`}>
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
                      onClick={() => handleOptionClick(option.value)}
                      className={`${
                        currentQuestion.options.some(opt => opt.image) 
                          ? 'lg:p-4 lg:rounded-lg lg:flex lg:flex-col lg:items-center lg:justify-center lg:space-y-4 w-full p-4 sm:p-4 rounded-full text-left group'
                          : 'w-full p-4 sm:p-4 rounded-full text-left group'
                      } ${
                        selectedAnswer === option.value
                          ? currentQuestion.options.some(opt => opt.image)
                            ? 'lg:bg-black lg:text-white highlight-bg text-white'
                            : 'highlight-bg text-white'
                          : currentQuestion.options.some(opt => opt.image)
                            ? 'lg:bg-white lg:text-black lg:hover:bg-gray-50 lg:hover:text-black bg-white text-black highlight-hover hover:text-white'
                            : 'bg-white text-black highlight-hover hover:text-white'
                      }`}
                    >
                      {option.image ? (
                        <>
                          {/* Mobile: Image-only style (no checkbox) */}
                          <div className="lg:hidden flex items-center space-x-3 sm:space-x-4">
                            <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                              <div className="flex items-center justify-center flex-shrink-0">
                                <img 
                                  src={option.image} 
                                  alt={option.label}
                                  className={`w-6 h-6 sm:w-8 sm:h-8 object-contain${selectedAnswer === option.value ? 'invert' : ''}`}
                                />
                              </div>
                              <span className="text-base sm:text-lg font-medium">{option.label}</span>
                            </div>
                          </div>
                          
                          {/* Desktop: Card style with image */}
                          <div className="hidden lg:block !mt-0">
                            <div className="max-w-32 flex items-center justify-center">
                              <img 
                                src={option.image} 
                                alt={option.label}
                                className={` ${selectedAnswer === option.value ? 'invert' : ''}`}
                              />
                            </div>
                            <span className="text-base font-medium text-center w-full flex items-center justify-center mt-2">{option.label}</span>
                          </div>
                        </>
                      ) : (
                        // Original radio button style
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center  ${
                            selectedAnswer === option.value
                              ? 'bg-white'
                              : 'bg-gray-200 group-hover:bg-white'
                          }`}>
                            {selectedAnswer === option.value ? (
                              <Check size={10} className="sm:w-3 sm:h-3 highlight-text" />
                            ) : (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full group-hover:hidden" />
                            )}
                            <Check size={16} className="sm:w-5 sm:h-5 highlight-text hidden group-hover:block" strokeWidth={3} />
                          </div>
                          <span className="text-base sm:text-lg font-medium">{option.label}</span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Info Box */}
                <div className="flex items-start space-x-3 sm:space-x-4 max-w-md mx-auto highlight-bg-transparent rounded-2xl p-4 sm:p-6">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 highlight-bg rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info size={12} className="sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-gray-700">
                      {currentQuestion.info}
                      {currentQuestion.helpPhone && (
                        <span className="block mt-2 sm:mt-3">
                          Need help? Call{' '}
                          <a 
                            href={`tel:${currentQuestion.helpPhone}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {currentQuestion.helpPhone}
                          </a>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          
        
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          {(currentStep > 0 || showAddressSearch) && (
            <button
              onClick={handleBack}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6 strokeWidth={2} text-black" />
            </button>
          )}


        </div>
      </footer>
    </div>
  )
} 