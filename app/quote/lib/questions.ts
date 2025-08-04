export interface Question {
  id: string
  question: string
  hint?: string
  options: {
    value: string
    label: string
    image?: string
  }[]
  info?: string
  helpPhone?: string
}

export const questions: Question[] = [
  {
    id: 'boiler-fuel',
    question: 'Which fuel powers your boiler?',
    options: [
      { 
        value: 'mains-gas', 
        label: 'Mains Gas',
        image: 'https://origin-gph.com/wp-content/themes/generatepress_child/boiler-setup/quote-img/mains-gas_1.png'
      },
      { 
        value: 'lpg', 
        label: 'LPG',
        image: 'https://origin-gph.com/wp-content/themes/generatepress_child/boiler-setup/quote-img/lpg.png'
      },
      { 
        value: 'other', 
        label: 'Other',
        image: 'https://origin-gph.com/wp-content/themes/generatepress_child/boiler-setup/quote-img/unknown.png'
      },
      { 
        value: 'other-2', 
        label: 'Other 2',
        image: 'https://origin-gph.com/wp-content/themes/generatepress_child/boiler-setup/quote-img/unknown.png'
      }
    ],
    info: 'Mains gas boilers are most common across the UK. If you have a gas meter, a gas bill, or a gas cooker, your boiler probably runs on gas.',
    helpPhone: '0330 113 1333'
  },
  {
    id: 'boiler-type-known',
    question: 'Do you know what type of boiler you currently have?',
    hint: 'Like, a combi boiler, regular boiler etc',
    options: [
      { value: 'yes', label: 'Yes, I know' },
      { value: 'no', label: "No, I'm not sure"}
    ],
    info: "If you know, select yes. If you don't, select that you're not sure and we'll figure it out for you in the next step.",
    helpPhone: '0330 113 1333'
  },
  {
    id: 'boiler-type',
    question: 'Which type of boiler do you currently have?',
    options: [
      { value: 'combi', label: 'Combi boiler' },
      { value: 'regular', label: 'Regular/Standard boiler' },
      { value: 'system', label: 'System boiler' },
      { value: 'back', label: 'Back boiler' }
    ],
    info: 'Combi boilers are the most common type of boiler in the UK. Regular/system boilers have separate tanks/cylinders, and back boilers are found behind fireplaces.'
  },
  {
    id: 'same-location',
    question: 'Do you want to keep boiler in the same place?',
    options: [
      { value: 'yes', label: 'Yes, I do' },
      { value: 'no', label: 'No, I want to move it' }
    ],
    info: 'Boiler relocations can be quite tricky, making your job more costly and complex. If you wish to relocate it, select no, and you\'ll see the pricing options on the next page.'
  },
  {
    id: 'property-type',
    question: 'Which type of property do you have?',
    options: [
      { value: 'house', label: 'A house' },
      { value: 'bungalow', label: 'A bungalow' },
      { value: 'flat', label: 'A flat/apartment' }
    ],
    info: 'This helps us to size your boiler, and also understand access for things such as your boiler\'s flue.'
  },
  {
    id: 'bathrooms',
    question: 'How many bathrooms does your home have?',
    options: [
      { value: '1', label: '1 bathroom' },
      { value: '2', label: '2 bathrooms' },
      { value: '3', label: '3 bathrooms' },
      { value: '4+', label: '4+ bathrooms' }
    ],
    info: 'This helps us to calculate the required power for your new boiler. The more bathrooms you have, the more powerful your boiler will need to be.'
  },
  {
    id: 'bedrooms',
    question: 'How many bedrooms does your home have?',
    options: [
      { value: '1', label: '1 bedroom' },
      { value: '2', label: '2 bedrooms' },
      { value: '3', label: '3 bedrooms' },
      { value: '4+', label: '4+ bedrooms' }
    ],
    info: 'This helps us to understand the size of your home, which then helps our system to size your boiler correctly.'
  },
  {
    id: 'wall-flue',
    question: 'Does your boiler\'s flue go out of the wall?',
    hint: 'It\'ll look a little something like this...',
    options: [
      { value: 'yes', label: 'Yes, it does' },
      { value: 'no', label: 'No, it doesn\'t' }
    ],
    info: 'Most flues go horizontally, out of the wall. They can either be round tubes popping out (modern, fanned flue), or, square shaped ones (balanced flue). Don\'t confuse your flue with your chimney.'
  },
  {
    id: 'flue-distance',
    question: 'Is your flue more than 30cm away from an opening window, or door?',
    hint: 'Flue distance',
    options: [
      { value: 'yes', label: 'Yes, it is' },
      { value: 'no', label: 'No, it isn\'t' }
    ],
    info: 'This includes any opening, like vents, doors, or opening windows. If it\'s near a window that doesn\'t open, select no.'
  },
  {
    id: 'water-meter',
    question: 'Does your home have a water meter?',
    options: [
      { value: 'yes', label: 'Yes, it does' },
      { value: 'no', label: 'No, it doesn\'t' }
    ],
    info: 'If you have a water meter, you\'ll pay for the water you use, rather than a fixed monthly cost on your bill'
  }
] 