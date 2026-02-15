import {createElement} from 'react'
import {defineField, defineType} from 'sanity'

const ExerciseIcon = () => createElement('span', null, '🏋️')

export const exercise = defineType({
  name: 'exercise',
  title: 'Exercise',
  description:
    'A single exercise entry, including its difficulty, media (image/video), and whether it is currently active in the app.',
  type: 'document',
  icon: ExerciseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'The name of the exercise.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'A short explanation of how to perform the exercise.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'workoutType',
      title: 'Workout Type',
      description: 'What kind of workout/equipment this exercise uses.',
      type: 'string',
      options: {
        list: [
          {title: 'Bodyweight', value: 'bodyweight'},
          {title: 'Cable machines', value: 'cableMachines'},
          {title: 'Cardio', value: 'cardio'},
          {title: 'Bench', value: 'bench'},
          {title: 'Barbell', value: 'barbell'},
          {title: 'Kettlebells', value: 'kettlebells'},
          {title: 'TRX', value: 'trx'},
          {title: 'Dumbbells', value: 'dumbbells'},
          {title: 'Other', value: 'other'},
        ],
      },
      initialValue: 'other',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      description: 'How challenging the exercise is for most people.',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
      initialValue: 'beginner',
    }),
    defineField({
      name: 'targets',
      title: 'Targets',
      description:
        'What this exercise targets. Select one or select multiple.',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Chest', value: 'Chest'},
          {title: 'Triceps', value: 'Triceps'},
          {title: 'Forearms', value: 'Forearms'},
          {title: 'Biceps', value: 'Biceps'},
          {title: 'Glutes', value: 'Glutes'},
          {title: 'Hamstrings', value: 'Hamstrings'},
          {title: 'Core', value: 'Core'},
          {title: 'Lats', value: 'Lats'},
          {title: 'Back', value: 'Back'},
          {title: 'Lower Body', value: 'Lower Body'},
          {title: 'Upper Body', value: 'Upper Body'},
          {title: 'Shoulders', value: 'Shoulders'},
          {title: 'Lower Back', value: 'Lower Back'},
          {title: 'Other', value: 'Other'},
        ],
        // Renders as a selectable checklist/grid (no free-typing)
        layout: 'grid',
      },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'whatsToLove',
      title: "What's to love",
      description:
        'Quick reasons people like this exercise (for example: "Great pump", "Easy to learn"). Add one or add multiple.',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'commonMistakes',
      title: 'Common mistakes',
      description:
        'Common form or setup mistakes to avoid (for example: "Flaring elbows"). Add one or add multiple.',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      description:
        'Step-by-step instructions for performing this exercise properly. Add one instruction or add multiple.',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'An optional image to visually demonstrate the exercise.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          description:
            "Describe what's in the image for screen readers and accessibility (also helps SEO if used on the web).",
          type: 'string',
          validation: (rule) => rule.required().warning('Alt text is recommended.'),
        }),
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'A link to a video demonstrating the exercise.',
      type: 'url',
      validation: (rule) =>
        rule
          .uri({scheme: ['http', 'https']})
          .warning('Use a valid URL starting with http:// or https://'),
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      description: 'Turn this on to make the exercise available in the app.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      isActive: 'isActive',
      workoutType: 'workoutType',
    },
    prepare({title, isActive, media, workoutType}) {
      const workoutTypeLabels: Record<string, string> = {
        bodyweight: 'Bodyweight',
        cableMachines: 'Cable machines',
        cardio: 'Cardio',
        bench: 'Bench',
        barbell: 'Barbell',
        kettlebells: 'Kettlebells',
        trx: 'TRX',
        dumbbells: 'Dumbbells',
        other: 'Other',
      }

      return {
        title,
        subtitle:
          (isActive === false ? 'Inactive' : 'Active') +
          (workoutType ? ` • ${workoutTypeLabels[workoutType] ?? workoutType}` : ''),
        media,
      }
    },
  },
})
