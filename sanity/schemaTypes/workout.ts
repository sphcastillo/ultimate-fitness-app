import { createElement } from 'react'
import { defineArrayMember, defineField, defineType } from 'sanity'

const WorkoutIcon = () => createElement('span', null, '🗓️')

export const workout = defineType({
  name: 'workout',
  title: 'Workout',
  description:
    'A logged workout session for a specific user, including date, duration, and the exercises performed.',
  type: 'document',
  icon: WorkoutIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      description: "The Clerk user ID of the person who performed the workout.",
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Workout Date',
      description: 'The date when this workout was performed.',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      description: 'The total duration of the workout in seconds.',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'exercises',
      title: 'Workout Exercises',
      description: 'The exercises performed in this workout with sets, reps and weights.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'workoutExercise',
          title: 'Workout exercise',
          type: 'object',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              description: 'The exercise that was performed.',
              type: 'reference',
              to: [{ type: 'exercise' }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              description: 'The sets performed for this exercise with repetitions and weight details.',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'exerciseSet',
                  title: 'Exercise Set',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Repetitions',
                      description: 'The number of repetitions performed in this set.',
                      type: 'number',
                      validation: (rule) => rule.required().integer().min(0),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      description: 'The weight used for this set.',
                      type: 'number',
                      validation: (rule) => rule.min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight unit',
                      description: 'The unit of measurement for the weight',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Pounds (lbs)', value: 'lbs' },
                          { title: 'Kilograms (kg)', value: 'kg' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'lbs',
                    }),
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      unit: 'weightUnit',
                    },
                    prepare({ reps, weight, unit }) {
                      return {
                        title: `Set • ${reps ?? 0} reps`,
                        subtitle: weight ? `${weight} ${unit ?? ''}` : 'Bodyweight',
                      }
                    }

                  },

                }),
              ],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: 'exercise.name',
              sets: 'sets',
            },
            prepare({title, sets}) {
              const setCount = Array.isArray(sets) ? sets.length : 0
              return {
                title: title || 'Exercise',
                subtitle: `${setCount} set${setCount === 1 ? '' : 's'}`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      date: 'date',
      exercises: 'exercises',
      duration: 'duration',
    },
    prepare({ date, exercises, duration }) {
      const workoutDate = date ? new Date(date).toLocaleDateString() : 'No date'
      const exerciseCount = Array.isArray(exercises) ? exercises.length : 0
      const durationMinutes = typeof duration === 'number' ? Math.round(duration / 60) : 0

      return {
        title: `Workout — ${workoutDate}`,
        subtitle: `${durationMinutes} min • ${exerciseCount} exercise${exerciseCount === 1 ? '' : 's'}`,
      }

    },
  },
})
