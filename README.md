# Invoice App
This application can be accessed at the following link: [Invoice App](https://670ff368a056730008a5e91b--vermillion-toffee-6abc03.netlify.app/). The frontend is deployed using **Netlify**, while the backend is hosted on **Railway**.

## Technology Stack
- **Frontend**: Built using **ReactJS**, with **CanvasJS** for pan and zoom chart functionalities.
- **Backend**: Utilizes **Node.js** runtime, **Express.js** framework, and **Sequelize** as the ORM on **PostgreSQL** database.

## Quick Description
1. **Hard Coded Products**: The application currently features hardcoded product data, and as such, there is no functionality to add products dynamically through the interface.
2. **Invoice History**: The "Invoice History" section implements pagination to efficiently fetch data. Users can click on each card to view detailed invoice information.
3. **Dummy Data Generation**: A significant amount of dummy data has been generated (see the `init.js` file) to facilitate clear visibility of report data.
4. **Chart Data Usage**: Users can view chart data by specifying:
   - **By Date**: Use the date `16/10/2024`
   - **By Month**: Use the format `10/2024`
   - **By Year**: Use the year `2024`
5. **Pan and Zoom Feature**: To utilize the pan and zoom capabilities, users can hold and drag the mouse over the timeline to focus on specific data points.
