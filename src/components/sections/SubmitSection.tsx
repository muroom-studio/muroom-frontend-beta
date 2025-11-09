import Image from 'next/image';
import SubmitForm from './SubmitForm';

export default function SubmitSection() {
    return (
        <section
            id='submit-form'
            className='w-full min-w-90 desktop:w-306 desktop:min-w-306 relative px-4 desktop:px-25'
        >
            <SubmitForm />
        </section>
    );
}
