import React, { Component } from 'react';
import { Row, Col, Label, Card, CardImg, Button, ModalHeader, ModalBody, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Modal } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent'
import { baseUrl } from '../shared/baseUrl'
import { FadeTransform, Fade, Stagger } from 'react-animation-components'

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

function RenderDish({ dish }) {
    return (
        <div className="col-12 col-md-5 m-1 ">
            <FadeTransform in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%) '
                }}>

                <Card>
                    <CardImg width="100%" object src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    )
}

function RenderComments({ commentsArray, postComment, dishId }) {

    const comments = commentsArray.map((comment) => {
        return (
            <div>
                <li key={comment.id} className="row">
                    <div className="col-12">
                        {comment.comment}
                        <br></br>
                        <br></br>
                    </div>
                    <div className="col-12">
                        <span>--{comment.author},</span>
                        <span> {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</span>
                        <br></br>
                        <br></br>
                    </div>
                </li>
            </div>
        );
    });

    if (commentsArray != null) {
        return (
            <div className="col-12 col-md-5 m-1 ">
                <h4>Comments</h4>
                <div className="list-unstyled">
                    <Stagger in>
                        <Fade in>
                            {comments}
                            {comments.author}
                        </Fade>
                    </Stagger>
                </div>

                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        )
    }
    else {
        return (
            <div></div>
        );
    }
}

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalopen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    toggleModal() {
        this.setState({
            isModalopen: !this.state.isModalopen
        })
    }

    handleSubmit(values) {
        this.toggleModal()
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {
        return (
            <React.Fragment>
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-edit fa-lg"></span> Comment Submit
                </Button>
                <Modal isOpen={this.state.isModalopen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">

                                <Label htmlFor="rating" xs={12}>Rating</Label>
                                <Col xs={12}>
                                    <Control type="number" model=".rating" id="rating" name="rating"
                                        placeholder="1-5"
                                        className="form-control"
                                        min={1}
                                        max={5}
                                        validators={{
                                            required
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".rating"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="yourname" xs={12}>Your Name</Label>
                                <Col xs={12}>
                                    <Control.text model=".yourname" id="yourname" name="yourname"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".yourname"
                                        show="touched"
                                        messages={{
                                            required: 'Required;',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" xs={12}>Comment</Label>
                                <Col xs={12}>
                                    <Control.textarea model=".message" id="message" name="message"
                                        rows="6"
                                        className="form-control" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col >
                                    <Button type="submit" color="primary">
                                        Send Feedback
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}

const DishDetail = (props) => {
    if (props.isLoading) {
        return (
            <div className="container" >
                <div className="row">
                    <Loading />
                </div>

            </div>
        )
    }
    else if (props.errMess) {
        return (
            <div className="container" >
                <div className="row">
                    <h4>{props.errMess}  </h4>
                </div>
            </div>
        )
    }
    else if (props.dish != null) {
        return (
            <div className="container">

                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                    </div>
                </div>

                <div className="row ">
                    <RenderDish dish={props.dish} />
                    <RenderComments commentsArray={props.comments}
                        postComment={props.postComment}
                        dishId={props.dish.id}
                    />
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="row"></div>
        );
    }
}

export default DishDetail;