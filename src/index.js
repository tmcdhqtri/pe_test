import React from "react";
import ReactDOM from "react-dom";
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm
} from "react-crud-table";

// Component's Base CSS
import "./index.css";

const DescriptionRenderer = ({ field }) => <textarea {...field} />;

let students = [
  {
    id: 1,
    name: "Tran Manh Cuong",
    description: "Student from class SE1604"
  },
  {
    id: 2,
    name: "Tran Van Nhan",
    description: "Student from class SE1602"
  },
];

const SORTERS = {
  NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a))
};

const getSorter = data => {
  const mapper = x => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

  if (data.field === "id") {
    sorter =
      data.direction === "ascending"
        ? SORTERS.NUMBER_ASCENDING(mapper)
        : SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter =
      data.direction === "ascending"
        ? SORTERS.STRING_ASCENDING(mapper)
        : SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};

let count = students.length;
const service = {
  fetchItems: payload => {
    let result = Array.from(students);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result);
  },
  create: student => {
    count += 1;
    students.push({
      ...student,
      id: count
    });
    return Promise.resolve(student);
  },
  update: data => {
    const student = students.find(t => t.id === data.id);
    student.name = data.name;
    student.description = data.description;
    return Promise.resolve(student);
  },
  delete: data => {
    const student = students.find(t => t.id === data.id);
    students = students.filter(t => t.id !== student.id);
    return Promise.resolve(student);
  }
};

const styles = {
  container: { margin: "auto", width: "fit-content" }
};

const Example = () => (
  <div style={styles.container}>
    <CRUDTable
      caption="Student List"
      fetchItems={payload => service.fetchItems(payload)}
    >
      <Fields>
        <Field name="id" label="Id" hideInCreateForm  hideInUpdateForm/>
        <Field name="name" label="Name" placeholder="Name" />
        <Field
          name="description"
          label="Description"
          render={DescriptionRenderer}
        />
      </Fields>
      <CreateForm
        name="Student Creation"
        message="Create a new student!"
        trigger="Create Student"
        onSubmit={student => service.create(student)}
        submitText="Create"
        validate={values => {
          const errors = {};
          if (!values.name) {
            errors.name = "Please, provide student's name";
          }

          if (!values.description) {
            errors.description = "Please, provide student's description";
          }

          return errors;
        }}
      />

      <UpdateForm
        name="Student Update Process"
        message="Update student"
        trigger="Update"
        onSubmit={student => service.update(student)}
        submitText="Update"
        validate={values => {
          const errors = {};
          if (!values.name) {
            errors.name = "Please, provide student's name";
          }

          if (!values.description) {
            errors.description = "Please, provide stundent's description";
          }

          return errors;
        }}
      />

      <DeleteForm
        name="Student Delete Process"
        message="Are you sure you want to delete student?"
        trigger="Delete"
        onSubmit={student => service.delete(student)}
        submitText="Delete"
        validate={values => {
          const errors = {};
          if (!values.id) {
            errors.id = "Please, provide id";
          }
          return errors;
        }}
      />
    </CRUDTable>
  </div>
);

Example.propTypes = {};

ReactDOM.render(<Example />, document.getElementById("root"));
