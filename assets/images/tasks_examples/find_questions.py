#!/usr/bin/env python3
from datasets import load_dataset
import json

# Load the dataset
print("Loading HERBench dataset...")
dataset = load_dataset("DanBenAmi/HERBench", split="test")

# Questions to search for (key phrases from each image)
questions_to_find = {
    "TSO": "The following 4 shots",
    "SVA": "From the correctly described shots, which is the one that appears first",
    "RLPC": "How many people passed through the bottom half of the frame",
    "MPDR": "Who stayed in the frame FOV for the longest time",
    "MEGL": "From which edge of the frame did they exit",
    "FOM": "which of the following objects the camera wearer of the video did NOT interact with",
    "FAM": "Which of the following actions did NOT occur",
    "ASII": "What is the correct temporal order of the 5 narrated events",
    "AGLT": "where does the individual initially start moving from",
    "AGBI": "What notable action does the person perform near a machine",
    "AGAR": "she passes an individual on the left wearing what kind of clothing",
    "AC": "How many times does the action-object pair 'open fridge door' occur"
}

results = {}

print(f"Total samples in dataset: {len(dataset)}")
print("\nSearching for questions...\n")

# Search through dataset
for idx, item in enumerate(dataset):
    question = item.get('question', '').lower()

    for task_code, search_phrase in questions_to_find.items():
        if task_code not in results:
            if search_phrase.lower() in question:
                results[task_code] = {
                    'question_id': item.get('question_id', f'idx_{idx}'),
                    'video_path': item.get('video_path', 'N/A'),
                    'question': item.get('question', 'N/A'),
                    'task': item.get('task', 'N/A')
                }
                print(f"Found {task_code}: question_id={results[task_code]['question_id']}")

print(f"\n\nFound {len(results)} out of {len(questions_to_find)} questions")
print("\n" + "="*80)
print("RESULTS:")
print("="*80)

for task_code in sorted(results.keys()):
    info = results[task_code]
    print(f"\nTask: {task_code}")
    print(f"  Question ID: {info['question_id']}")
    print(f"  Video Path: {info['video_path']}")
    print(f"  Task Name: {info['task']}")
    print(f"  Question: {info['question'][:100]}...")

# Save results to JSON
with open('question_matches.json', 'w') as f:
    json.dump(results, f, indent=2)

print("\n\nResults saved to question_matches.json")
