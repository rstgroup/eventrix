import findIndex from 'lodash/findIndex';
import { EventsReceiver } from 'eventrix';
import { CREATE_TASK_EVENT_NAME, MARK_TASK_AS_DONE_EVENT_NAME, MARK_TASK_AS_TODO_EVENT_NAME, REMOVE_TASK_EVENT_NAME } from '../taskEvents';

const createTaskReceiver = new EventsReceiver(CREATE_TASK_EVENT_NAME, (eventName, { task }, stateManager) => {
    const tasks = stateManager.getState('tasks');
    stateManager.setState('tasks', [task, ...tasks]);
});

const removeTaskReceiver = new EventsReceiver(REMOVE_TASK_EVENT_NAME, (eventName, { id }, stateManager) => {
    const tasks = stateManager.getState('tasks');
    const newTasks = tasks.filter((task) => task.id !== id);
    stateManager.setState('tasks', newTasks);
});

const markAsDoneReceiver = new EventsReceiver(MARK_TASK_AS_DONE_EVENT_NAME, (eventName, { id }, stateManager) => {
    const tasks = stateManager.getState('tasks');
    const taskIndex = findIndex(tasks, (task) => task.id === id);
    const task = { ...tasks[taskIndex], status: 'done' };
    stateManager.setState(`tasks.${taskIndex}`, task);
});

const markAsTodoReceiver = new EventsReceiver(MARK_TASK_AS_TODO_EVENT_NAME, (eventName, { id }, stateManager) => {
    const tasks = stateManager.getState('tasks');
    const taskIndex = findIndex(tasks, (task) => task.id === id);
    const task = { ...tasks[taskIndex], status: 'todo' };
    stateManager.setState(`tasks.${taskIndex}`, task);
});

export default [markAsDoneReceiver, markAsTodoReceiver, createTaskReceiver, removeTaskReceiver];
